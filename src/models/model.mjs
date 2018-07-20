import Debug from 'debug'
import Knex from 'knex'
import { join } from 'path'
import { knexSnakeCaseMappers, Model, QueryBuilder } from 'objection'

import { db } from '../../secret'
import { rootPath } from '../config'

const debug = Debug('bitmidi:model')

class BaseQueryBuilder extends QueryBuilder {
  // Suppress knex warning ("A valid integer must be provided to limit") when
  // `pageSize` is Infinity
  page (page, pageSize) {
    if (pageSize === Infinity) pageSize = Number.MAX_SAFE_INTEGER
    return super.page(page, pageSize)
  }
}

export default class BaseModel extends Model {
  // Use a custom query builder
  static QueryBuilder = BaseQueryBuilder

  // Lookup model names referenced in `relationMappings` in this folder
  static modelPaths = join(rootPath, 'src', 'models')

  // Add limit(1) to first() and findOne() queries
  static useLimitInFirst = true

  // Set the status code to 404 when items are not found
  static createNotFoundError (queryContext) {
    const err = new this.NotFoundError()
    err.status = 404
    return err
  }

  // Log raw SQL queries
  static query (...args) {
    return super.query(...args)
      .runAfter((models, query) => {
        debug(query.toString())
        return models
      })
  }

  $beforeInsert () {
    this.createdAt = new Date()
  }

  $beforeUpdate () {
    this.updatedAt = new Date()
  }
}

// Create database connection
const knex = Knex({ ...db, ...knexSnakeCaseMappers() })

// Use the connection for *all* models
BaseModel.knex(knex)
