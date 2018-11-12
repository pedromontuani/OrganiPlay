import { NgModule } from '@angular/core';
import { CustomHeaderComponent } from './custom-header/custom-header';
import { UserInfoComponent } from './user-info/user-info';
import { UserMenuComponent } from './user-menu/user-menu';
import { MenuAdminComponent } from './menu-admin/menu-admin';
import { AdminHeaderComponent } from './admin-header/admin-header';
import { UserStatusComponent } from './user-status/user-status';
import { ItemLojaComponent } from './item-loja/item-loja';
@NgModule({
	declarations: [CustomHeaderComponent,
    UserInfoComponent,
    UserMenuComponent,
    MenuAdminComponent,
    AdminHeaderComponent,
    UserStatusComponent,
    ItemLojaComponent,
    ItemLojaComponent],
	imports: [],
	exports: [CustomHeaderComponent,
    UserInfoComponent,
    UserMenuComponent,
    MenuAdminComponent,
    AdminHeaderComponent,
    UserStatusComponent,
    ItemLojaComponent,
    ItemLojaComponent]
})
export class ComponentsModule {}
