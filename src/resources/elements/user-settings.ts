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
    this.user = user;
  }

  async updateSettings() {
    await this.ds.editUser(this.user.firstName, this.user.lastName, this.user.password);
    console.log('User updated');
  }

  async deleteAccount() {
    await this.ds.deleteUser(this.user);
    console.log('deleting account');
  }
}
