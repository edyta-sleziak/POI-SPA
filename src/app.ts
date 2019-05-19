import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      {
        route: ['', 'islands'],
        name: 'Islands',
        moduleId: PLATFORM.moduleName('views/islands'),
        nav: true,
        title: 'Islands'
      },
      {
        route: 'user',
        name: 'User',
        moduleId: PLATFORM.moduleName('views/users'),
        nav: true,
        title: 'User'
      },
      {
        route: 'logout',
        name: 'logout',
        moduleId: PLATFORM.moduleName('views/logout'),
        nav: true,
        title: 'Logout'
      }
    ]);
    this.router = router;
  }
}
