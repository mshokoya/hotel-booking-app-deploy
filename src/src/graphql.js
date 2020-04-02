"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var listings_1 = require("./listings");
var Listing = new graphql_1.GraphQLObjectType({
    name: 'listing',
    fields: {
        id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        title: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        image: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        address: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        price: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        numOfGuests: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        numOfBeds: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        numOfBaths: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        rating: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
    }
});
var query = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: {
        listings: {
            type: graphql_1.GraphQLNonNull(graphql_1.GraphQLList(graphql_1.GraphQLNonNull(Listing))),
            resolve: function () { return listings_1.listings; }
        }
    }
});
var mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        deleteListing: {
            type: graphql_1.GraphQLNonNull(Listing),
            args: {
                id: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
            },
            resolve: function (_root, _a) {
                var id = _a.id;
                for (var i = 0; i < listings_1.listings.length; i++) {
                    if (id === listings_1.listings[i].id) {
                        return listings_1.listings.splice(i, 1)[0];
                    }
                }
                throw new Error('failed to delete Listing');
            }
        }
    }
});
exports.schema = new graphql_1.GraphQLSchema({ query: query, mutation: mutation });
