import schema from '../api/schema'
import resolvers from '../api/resolvers'
import Responses from '../api/responses'

import { graphql } from 'graphql'

const sharedContext = {}

let runGraphql = ({query, variables, operationName}) => {
    return graphql(schema, query, resolvers, sharedContext, variables, operationName)
        .then(Responses.success)
        .catch(Responses.error)
}

let handleGet = (event) => event.queryStringParameters

let handlePost = (event) => JSON.parse(event.body)

const VALID_METHODS = ['GET', 'POST']

export async function handler(event, context) {
    try {
        if(!VALID_METHODS.includes(event.httpMethod))
            return {
                statusCode: 405,
                body: JSON.stringify({ msg: 'Only GET and POST are supported' })
            }


        return await runGraphql(event.httpMethod === 'GET' ? handleGet(event) : handlePost(event))

    } catch (err) {
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message })
        }
    }
}
