import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { User, Island, Category, Review } from './poi-interfaces';
import { HttpClient } from 'aurelia-http-client';
//import { Marker } from './ea-service';
import { EventAggregator } from 'aurelia-event-aggregator';

let loggedUser = null;

@inject(HttpClient, Aurelia, Router, EventAggregator)
export class IslandService {
  islands: Island[] = [];
  categories: Category[] = [];
  reviews: Review[] = [];
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
    await this.getCategories();
    islands.forEach(island => {
      try {
        island.categoryName = (this.categories.find(category => island.category == category._id)).name;
      } catch (e) {
        island.categoryName = '[UNKNOWN]';
      }
      this.ea.publish('showMarkers', island);
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
  }

  async quickAddIsland(name: string, category: string, latitude: string, longitude: string) {
    let newIsland = {
      name: name,
      category: category,
      categoryName: '',
      latitude: latitude,
      longitude: longitude,
    };
    const response = await this.httpClient.post('/api/poi', newIsland);
    newIsland = response.content;
    try {
      newIsland.categoryName = (this.categories.find(category => newIsland.category == category._id)).name;
    } catch (e) {
      newIsland.categoryName = '[UNKNOWN]';
    }
    this.islands.push(newIsland);
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

  async getCategoryById(id: string) {
    const response = await this.httpClient.get('/api/category/' + id);
    return response.content;
  }

  async getUserNameById(id: string) {
    const response = await this.httpClient.get('/api/getUserName/' + id);
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
    console.log( response);
    await this.login(newUser.email, user.password);
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
      await this.getUsers();
      await this.getCategories();
      this.changeRouter(PLATFORM.moduleName('app'));
      return true;
    } else {
      return false;
    }
  }

  async getReviews(id: String) {
    try {
      const response = await this.httpClient.get('/api/review/' + id + '/island');
      const reviews = await response.content;

      this.reviews = [];

      for (const review of reviews) {
        review.addedByName = await this.getUserNameById(review.addedBy);
        this.reviews.push(review);
      }
    }
    catch {
      console.log('Error occurred');
    }
  }

  async addReview(reviewText: string, island: string) {
    const request = {
      reviewText: reviewText,
      island: island
    };
    const response = await this.httpClient.post('/api/review', request);
    const newReview = response.content;
    this.reviews.push(newReview);
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
