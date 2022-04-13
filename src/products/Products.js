const knexLib = require("knex");

class Products {
  constructor(options, tableName) {
    (this.knex = knexLib(options)), (this.tableName = tableName);
  }

  async listById(id) {
    try {
      const Id = await this.knex
        .from(this.tableName)
        .select("*")
        .where("id", id);
      return Id;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async listAll() {
    try {
      const getAll = await this.knex.from(this.tableName).select("*");
      return getAll;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async save(obj) {
    try {
      const save = await this.knex(this.tableName).insert(obj);
      return save;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updated(id, param) {
    try {
      const update = await this.knex
        .from(this.tableName)
        .where("id", id)
        .update(param);
      return update;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async eraseById(id) {
    try {
      const byId = await this.knex.from(this.tableName).where("id", id).del();
      return byId;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async eraseAll() {
    try {
      const del = await this.knex.from(this.tableName).del();
      return del;
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = Products;