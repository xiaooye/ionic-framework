import { AnimationBuilder, BackButtonEvent, MenuI } from '../../interface';
import { MENU_BACK_BUTTON_PRIORITY } from '../hardware-back-button';
import { componentOnReady } from '../helpers';

import { menuOverlayAnimation } from './animations/overlay';
import { menuPushAnimation } from './animations/push';
import { menuRevealAnimation } from './animations/reveal';

const createMenuController = () => {
  const menuAnimations = new Map<string, AnimationBuilder>();
  const menus: MenuI[] = [];
  console.log("[top] menus from top of createMenuController:", menus);

  const open = async (menu?: string | null): Promise<boolean> => {
    console.log("[open] open called on menu:", menu);
    const menuEl = await get(menu);
    console.log("[open] found:", menuEl);
    if (menuEl) {
      return menuEl.open();
    }
    return false;
  };

  const close = async (menu?: string | null): Promise<boolean> => {
    console.log("[close] close called on menu:", menu);
    const menuEl = await (menu !== undefined ? get(menu) : getOpen());
    console.log("[close] found:", menuEl);
    if (menuEl !== undefined) {
      return menuEl.close();
    }
    return false;
  };

  const toggle = async (menu?: string | null): Promise<boolean> => {
    console.log("[toggle] toggle called on menu:", menu);
    const menuEl = await get(menu);
    console.log("[toggle] found:", menuEl);
    if (menuEl) {
      return menuEl.toggle();
    }
    return false;
  };

  const enable = async (shouldEnable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined> => {
    console.log("[enable] enable called on menu:", menu);
    const menuEl = await get(menu);
    console.log("[enable] found:", menuEl);
    if (menuEl) {
      menuEl.disabled = !shouldEnable;
    }
    return menuEl;
  };

  const swipeGesture = async (shouldEnable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined> => {
    const menuEl = await get(menu);
    if (menuEl) {
      menuEl.swipeGesture = shouldEnable;
    }
    return menuEl;
  };

  const isOpen = async (menu?: string | null): Promise<boolean> => {
    if (menu != null) {
      const menuEl = await get(menu);
      return (menuEl !== undefined && menuEl.isOpen());
    } else {
      const menuEl = await getOpen();
      return menuEl !== undefined;
    }
  };

  const isEnabled = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu);
    if (menuEl) {
      return !menuEl.disabled;
    }
    return false;
  };

  const get = async (menu?: string | null): Promise<HTMLIonMenuElement | undefined> => {
    console.log("[get] get called for menu:", menu);
    await waitUntilReady();
    console.log("[get] ready");

    if (menu === 'start' || menu === 'end') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      const menuRef = find(m => m.side === menu && !m.disabled);
      console.log("[get] menu is start or end; search result:", menuRef);
      if (menuRef) {
        return menuRef;
      }

      // didn't find a menu side that is enabled
      // so try to get the first menu side found
      console.log("[get] not found; returning:", find(m => m.side === menu));
      return find(m => m.side === menu);

    } else if (menu != null) {
      // the menuId was not left or right
      // so try to get the menu by its "id"
      console.log("[get] menu not found by side; returning:", find(m => m.menuId === menu));
      return find(m => m.menuId === menu);
    }

    // return the first enabled menu
    const menuEl = find(m => !m.disabled);
    console.log("[get] searching for first enabled menu:", menuEl);
    if (menuEl) {
      return menuEl;
    }

    // get the first menu in the array, if one exists
    console.log("[get] searching for first menu period:", menus[0].el);
    return menus.length > 0 ? menus[0].el : undefined;
  };

  /**
   * Get the instance of the opened menu. Returns `null` if a menu is not found.
   */
  const getOpen = async (): Promise<HTMLIonMenuElement | undefined> => {
    await waitUntilReady();
    return _getOpenSync();
  };

  /**
   * Get all menu instances.
   */
  const getMenus = async (): Promise<HTMLIonMenuElement[]> => {
    await waitUntilReady();
    return getMenusSync();
  };

  /**
   * Get whether or not a menu is animating. Returns `true` if any
   * menu is currently animating.
   */
  const isAnimating = async (): Promise<boolean> => {
    await waitUntilReady();
    return isAnimatingSync();
  };

  const registerAnimation = (name: string, animation: AnimationBuilder) => {
    menuAnimations.set(name, animation);
  };

  const _register = (menu: MenuI) => {
    console.log("[register] register called for menu:", menu);
    if (menus.indexOf(menu) < 0) {
      if (!menu.disabled) {
        _setActiveMenu(menu);
      }
      menus.push(menu);
    }
  };

  const _unregister = (menu: MenuI) => {
    console.log("[unregister] unregister called for menu:", menu);
    const index = menus.indexOf(menu);
    if (index > -1) {
      menus.splice(index, 1);
    }
  };

  const _setActiveMenu = (menu: MenuI) => {
    // if this menu should be enabled
    // then find all the other menus on this same side
    // and automatically disable other same side menus
    const side = menu.side;
    menus
      .filter(m => m.side === side && m !== menu)
      .forEach(m => m.disabled = true);
  };

  const _setOpen = async (menu: MenuI, shouldOpen: boolean, animated: boolean): Promise<boolean> => {
    if (isAnimatingSync()) {
      return false;
    }
    if (shouldOpen) {
      const openedMenu = await getOpen();
      if (openedMenu && menu.el !== openedMenu) {
        await openedMenu.setOpen(false, false);
      }
    }
    return menu._setOpen(shouldOpen, animated);
  };

  const _createAnimation = (type: string, menuCmp: MenuI) => {
    const animationBuilder = menuAnimations.get(type) as any;
    if (!animationBuilder) {
      throw new Error('animation not registered');
    }

    const animation = animationBuilder(menuCmp);
    return animation;
  };

  const _getOpenSync = (): HTMLIonMenuElement | undefined => {
    return find(m => m._isOpen);
  };

  const getMenusSync = (): HTMLIonMenuElement[] => {
    return menus.map(menu => menu.el);
  };

  const isAnimatingSync = (): boolean => {
    return menus.some(menu => menu.isAnimating);
  };

  const find = (predicate: (menu: MenuI) => boolean): HTMLIonMenuElement | undefined => {
    console.log("[find] find called; current menus:", menus);
    const instance = menus.find(predicate);
    if (instance !== undefined) {
      return instance.el;
    }
    return undefined;
  };

  const waitUntilReady = () => {
    return Promise.all(
      Array.from(document.querySelectorAll('ion-menu'))
        .map(menu => new Promise(resolve => componentOnReady(menu, resolve)))
    );
  };

  registerAnimation('reveal', menuRevealAnimation);
  registerAnimation('push', menuPushAnimation);
  registerAnimation('overlay', menuOverlayAnimation);

  /* tslint:disable-next-line */
  if (typeof document !== 'undefined') {
    document.addEventListener('ionBackButton', (ev: any) => {
      const openMenu = _getOpenSync();
      if (openMenu) {
        (ev as BackButtonEvent).detail.register(MENU_BACK_BUTTON_PRIORITY, () => {
          return openMenu.close();
        });
      }
    });
  }

  return {
    registerAnimation,
    get,
    getMenus,
    getOpen,
    isEnabled,
    swipeGesture,
    isAnimating,
    isOpen,
    enable,
    toggle,
    close,
    open,
    _getOpenSync,
    _createAnimation,
    _register,
    _unregister,
    _setOpen,
    _setActiveMenu,
  };
};

export const menuController = /*@__PURE__*/createMenuController();
