import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient} from '@angular/common/http';
import { Platform } from '@ionic/angular/providers/platform';

@Injectable({
  providedIn: 'root'
})
export class CRUDserviceService {

  database: SQLiteObject;

  constructor(private plt: Platform, private Sqlite: SQLite, private http: HttpClient, private sqlitePorter: SQLitePorter) {
    this.plt.ready().then(this.connectDB);
   }


  connectDB() {
    this.Sqlite.create({
      name: 'financialAppDB.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.database = db;
      this.seedDatabase();
  });
  }

  seedDatabase() {
    this.http.get('../../assets/financialappbd.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadusers();
          this.loadcards();
        })
        .catch(e => console.error(e));
    });
  }

  async loadusers() {
    const Users = [];
    return this.database.executeSql('SELECT * FROM user', []).then(data => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          // RETRIEVE ALL CARDS FOR AN USER AND CONVERT THEM
          let cardsNumber = [];
          cardsNumber = JSON.parse(data.rows.item(i).cardsNumber);
          Users.push(data.res.rows.item(i));


          // RETRIEVE OTHER USER DATAS
          Users.push({
            id: data.rows.item(i).id,
            login: data.rows.item(i).login,
            password: data.rows.item(i).password,
            nom: data.rows.item(i).nom,
            prenom: data.rows.item(i).prenom,
            birthday: data.rows.item(i).birthday,
            userSessionToken: data.rows.item(i).userSessionToken
          });
        }
  }
    }, (e) => {

      console.log('Error: ' + JSON.stringify(e));
  });
  }

  /* Load all cards data in the Phone DB */
  async loadcards() {
    const cards = [];
    return this.database.executeSql('SELECT * FROM cards', []).then(data => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          cards.push(data.res.rows.item(i));
        }
  }
    }, (e) => {

      console.log('Error: ' + JSON.stringify(e));
  });
  }

  // Function verify if a USER exist in the Database
  getuser(login: string, password: string) {
    let token: string;
    this.database.executeSql(`SELECT * FROM user WHERE login=${login} AND password=${password}`).then(data => {
      if ( data.res.row.length === 0 ) {
        return false;
       } else {
       return token = data.rows.item.userSessionToken;
      }
    }, (e) => {
      console.log('can not reach data: ' + JSON.stringify(e));
    });
  }

}







