/* ==============================================
EXTERNAL MODULES
============================================== */
const mongojs = require("mongojs");
const winston = require("winston");


function log(funcName, err) {
  winston.logger.get("database").error(funcName + " - " + err.toString());
}


class ActiveEdits {
  /**
   * @constructor
   * @param {mongojs_collection} collection 
   */
  constructor(collection) {
    this.collection = collection;
  }

  /**
   * Retrieves ActiveEdit linked with admin_chat_id.
   * If no error, data returned via callback is a list of ActiveEdit documents.
   * @param {integer} admin_chat_id 
   * @param {function} callback - (err, data)
   */
  get(admin_chat_id, callback) {
    this.collection.find(
      { admin_chat_id: admin_chat_id },
      function (err, data) {
        if (err) {
          log("ActiveEdits:get", err);
        }
        callback(err, data);
      }
    );
  }

  /**
   * 
   * @param {integer} admin_chat_id 
   * @param {string} type - "calendar" or "text"
   * @param {funcion} callback - (err)
   */
  post(admin_chat_id, type, callback) {
    this.collection.insert({
      admin_chat_id: admin_chat_id,
      creation_timestamp: Date.now(),
      type: type},
      function(err) {
        if (err) {
          log("ActiveEdits:post", err);
        }
        callback(err);
      }
    );
  }

  /**
   * 
   * @param {integer} admin_chat_id 
   * @param {string} property
   * @param {*} value 
   * @param {function} callback - (err)
   */
  patch(admin_chat_id, property, value, callback) {
    const update = { "$set": {} };
    update["$set"][property] = value;
    this.collection.update(
      { admin_chat_id: admin_chat_id },
      update,
      { upsert: false, multi: false },
      callback
    );
  }

  /**
   * 
   * @param {*} admin_chat_id 
   * @param {*} callback - (err0)
   */
  delete(admin_chat_id, callback) {
    this.collection.remove(
      { admin_chat_id: admin_chat_id },
      function(err) {
        if (err) {
          log("ActiveEdits:delete", err);
        }
        callback(err);
      }
    );
  }
}

module.exports = ActiveEdits;