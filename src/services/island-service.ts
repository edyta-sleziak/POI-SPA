import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { User, Island, Category, RawIsland } from './poi-interfaces';
import { HttpClient } from 'aurelia-http-client';
import { Marker } from './ea-service';
import { EventAggregator } from 'aurelia-event-aggregator';

let loggedUser = null;

@inject(HttpClient, Aurelia, Router, EventAggregator)
export class IslandService {
  islands: Island[] = [];
  categories: Category[] = [];
  users: Map<string, User> = new Map();
  usersById: Map<string, User> = new Map();

  constructor(
    private httpClient: HttpClient,
    private au: Aurelia,
    private router: Router,
    private ea: EventAggregator
  ) {
    httpClient.configure(http => {
      http.withBaseUrl('http://localhost:4000');
    });
  }

  async getIslands() {
    const response = await this.httpClient.get('/api/poi');
    const islands = await response.content;
    islands.forEach(island => {
      const newIsland = {
        name: island.name,
        description : island.description,
        longitude: island.longitude,
        latitude: island.latitude,
        category: this.categories.find(category => island.category == category._id),
        addedBy :this.users.get(island.addedBy),
        modifiedBy :this.users.get(island.modifiedBy),
        createdDate: island.createdDate,
        lastModifiedDate: island.lastModifiedDate,
        _id: island._id
      };
      this.ea.publish('showMarkers', newIsland);
      this.islands.push(island);
    });
  }

  async getUsers() {
    const response = await this.httpClient.get('/api/user');
    const users = await response.content;
    users.forEach(user => {
      this.users.set(user.email, user);
      this.usersById.set(user._id, user);
    });
  }

  async getCategories() {
    const response = await this.httpClient.get('/api/category');
    this.categories = await response.content;
    console.log (this.categories);
  }

  async quickAddIsland(name: string, category: Category, latitude: string, longitude: string) {
    const newIsland = {
      name: name,
      category: category,
      latitude: latitude,
      longitude: longitude,
    };
    const response = await this.httpClient.post('/api/poi', newIsland);
    this.islands.push(newIsland);
    //this.total = this.total+1;
    this.ea.publish('showMarkers',newIsland);
  }

  async editIsland(island: Island) {
    const response = await this.httpClient.put('/api/poi/' + island._id, island);
    console.log (response.content);
    return response.content;
  }

  async deleteIsland(id: string) {
    const response = await this.httpClient.delete('/api/poi/'+ id);
    return response.content
  }

  async getIslandData(id: string) {
    const response = await this.httpClient.get('/api/poi/' + id);
    return response.content;
  }

  async getUsersIslands(userId: string) {
    const id = userId;
    const response = await this.httpClient.get('/api/poi/'+id+'/userAdded');
    return response.content;
  }

  async editUser(user: User) {
    const response = await this.httpClient.put('/api/user/editUser', user);
    return response.content;
  }

  async deleteUser(user: User) {
    const userId = user._id;
    const response = await this.httpClient.delete('/api/user/'+userId);
  }

  async signup(firstName: string, lastName: string, email: string, password: string) {
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/user', user);
    const newUser = await response.content;
    this.users.set(newUser.email, newUser);
    this.usersById.set(newUser._id, newUser);
    this.httpClient.configure(configuration => {
      configuration.withHeader('Authorization', 'bearer ' + newUser.token);
    });
    console.log(newUser.token);
    localStorage.poi = JSON.stringify(response.content);
    this.changeRouter(PLATFORM.moduleName('app'));
    return false;
  }

  async getLoggedUserData() {
    try {
      const response = await this.httpClient.get('/api/user/getLoggedUserData');
      return response.content;
    }
    catch {
      console.log('Error occurred');
    }
  }

  async login(email: string, password: string) {
    const response = await this.httpClient.post('/api/user/authenticate', {
      email: email,
      password: password
    });
    const status = await response.content;
    if (status.success) {
      this.httpClient.configure(configuration => {
        configuration.withHeader('Authorization', 'bearer ' + status.token);
      });
      console.log(status.token);
      localStorage.poi = JSON.stringify(response.content);
      //await this.getIslands();
      await this.getUsers();
      await this.getCategories();
      this.changeRouter(PLATFORM.moduleName('app'));
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.poi = null;
    this.httpClient.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
    this.changeRouter(PLATFORM.moduleName('start'));
    loggedUser = null;
  }

  changeRouter(module:string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }

  checkIsAuthenticated() {
    let authenticated = false;
    if (localStorage.poi !== 'null') {
      authenticated = true;
      this.httpClient.configure(http => {
        const auth = JSON.parse(localStorage.poi);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
      this.changeRouter(PLATFORM.moduleName('app'));
    }
  }

}
