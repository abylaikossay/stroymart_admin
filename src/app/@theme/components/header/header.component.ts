import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';

import {LayoutService} from '../../../@core/utils';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  currentTheme = 'dark';

  userMenu = [{title: 'Profile'}, {title: 'Log out', link: '/auth/logout'}];

  constructor(private sidebarService: NbSidebarService,
              private router: Router,
              // private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService) {
  }

  backHome(): void {
    this.router.navigate(['admin/dashboard']);
  }

  ngOnInit() {
    this.themeService.changeTheme(this.currentTheme);
    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);
    this.user = {};
    this.user.name = localStorage.getItem(environment.userName);

    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$)
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // changeTheme(themeName: string) {
  //   this.themeService.changeTheme(themeName);
  // }
// TODO поменять адресс
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.router.navigate(['admin/dashboard']);
    return false;
  }

  logout() {
    this.router.navigate(['auth/logout']);
    // this.router.navigate()
  }
}
