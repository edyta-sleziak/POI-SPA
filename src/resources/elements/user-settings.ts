import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { User } from '../../services/poi-interfaces';
import {IslandService} from "../../services/island-service";

@inject(IslandService)
export class UserSettings {
  @bindable
  user: User;

  constructor(private ds: IslandService) {
    this.getData();
  }

  async getData() {
    const user = await this.ds.getLoggedUserData();
    user.password = null;
    this.user = user;
  }

  async updateSettings() {
    await this.ds.editUser(this.user);
    console.log('User updated');
  }

  async deleteAccount() {
    await this.ds.deleteUser(this.user);
    await this.ds.logout();
    console.log('deleting account');
  }
}
