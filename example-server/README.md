# Example River Server

**Disclaimer**

In a real world setting it's a good idea to use some sort of authorization in order to make changes to a feed. This is just an example server application to test and showcase the protocol in a practical way. Do not use this application as is.

## Description

This Node.js application is an example River server. It lets you create, read, update and delete River feeds. It's very naive and meant for testing.

## Setup

Preferably use `nvm` to install a suitable version of Node. I use `14.13.1` because it was listed as the latest stable version.

Install the dependencies:
```bash
$ npm install
```

Run the project with:
```bash
$ npm start
```

The application also needs a MongoDB database running.

## Usage

The application uses standard CRUD HTTP methods to manage River feeds.

### Add 

Use HTTP `POST` to create a River feed. Request body must conform to the [schema](../schema.json) described in the protocol specification.

```bash
$ curl -X "POST" "http://localhost:3000" \
       -H 'Content-Type: application/json; charset=utf-8' \
       -d $'{
    "title": "Title",
    "revisions": [
      {
        "date": "2020-10-18T11:12:31+0000",
        "url": "https://tracker.example.com/torrents/1603019551/Collection.of.Linux.ISOs.torrent"
      }
    ]
  }'
```

This gives you a response:

```json
{
  "id": "5f8f052fe7a0553796ce04ac",
  "title": "Title",
  "revisions": [
    {
      "date": "2020-10-18T11:12:31.000Z",
      "url": "https://tracker.example.com/torrents/1603019551/Collection.of.Linux.ISOs.torrent"
    }
  ]
}
```

The value of the `id` property is then used to read, update or delete this River.

### Get

Use the `id` returned when creating a River to get the link for the River client, then use the HTTP method `GET` to retrieve the River.

```bash
$ curl "http://localhost:3000/5f8f052fe7a0553796ce04ac"
```

This gives us the response:

```json
{
  "title": "Title",
  "revisions": [
    {
      "date": "2020-10-18T11:12:31.000Z",
      "url": "https://tracker.example.com/torrents/1603019551/Collection.of.Linux.ISOs.torrent"
    }
  ]
}
```

### Update

Use the `id` returned when creating a River to build the URL for updating a River. Updating is done with HTTP `PUT` and as long as the body still is valid it will replace the old River.

```bash
$ curl -X "PUT" "http://localhost:3000/5f8f052fe7a0553796ce04ac" \
       -H 'Content-Type: application/json; charset=utf-8' \
       -d $'{
    "title": "Updated Title",
    "revisions": [
      {
        "date": "2020-10-19T11:12:31+0000",
        "url": "https://tracker.example.com/torrents/1603019837/Collection.of.Linux.ISOs.torrent"
      },
      {
        "date": "2020-10-18T11:12:31+0000",
        "url": "https://tracker.example.com/torrents/1603019551/Collection.of.Linux.ISOs.torrent"
      }
    ]
  }'
```

It will return the updated River but for clarity's sake, do a `GET` request on the same URL again:

```bash
$ curl "http://localhost:3000/5f8f052fe7a0553796ce04ac"
```

This time it will return the updated River:
```json
{
  "title": "Updated Title",
  "revisions": [
    {
      "date": "2020-10-19T11:12:31.000Z",
      "url": "https://tracker.example.com/torrents/1603019837/Collection.of.Linux.ISOs.torrent"
    },
    {
      "date": "2020-10-18T11:12:31.000Z",
      "url": "https://tracker.example.com/torrents/1603019551/Collection.of.Linux.ISOs.torrent"
    }
  ]
}
```

### Delete

Use the `id` returned when creating a River to build the URL for deleting a River. Updating is done with HTTP `DELETE`.

```bash
$ curl -X "DELETE" "http://localhost:3000/5f8f052fe7a0553796ce04ac"
```

Deleting does not give a response, just a status code of 200 if the feed was deleted successfully and 204 if there was nothing to delete.

### Invalid Data

If trying to create or update a feed with data that does not conform to the schema the application will return a HTTP status code 400 with the raw error describing what's wrong.
