# SioApi
  Navigator module for making API requests and controlling the responses.
## Install
  ```bash
    npm install sioapi
  ```
## Import
  Bundle
    ```javascript
    import SioApi from "sioapi";
    ```
  CDN

    ```javascript
    import SioApi from "https://unpkg/sioapi";
    ```
## API
Creates a new SioApi Object. 

This module extends [SioEvents](https://github.com/empirreamm/SioEvents).

* ### Constructor: new SioApi(url).
  |Name|Type|Description|
  |---|---|---|
  |url|String|Url of the API, leave blank to use current host.

* ### Events: .on(eventName,callback).
  Check [SioEvents](https://github.com/empirreamm/SioEvents) for more details

  |Event|Fire Time|Data|
  |---|---|---|
  |response|Whenever a response from the server is received|[Call Object](#call)

* ### Methods

  * #### .getService(name).
      Creates a new [Service Object](#service) to the API url/name

  * #### .setHeader(name,value).
      Sets a header to be send to every petition on this api.

  * #### .removeHeader(name).
      Removes a header from the apis
  
  * ### [Async] .get(suburl="",options={}) __or__ .get(options={})
      1. If subUrl is setted makes a GET fetch to [API.url](#api)/subUrl with the options.
      2. If subUrl is not setted makes a GET fetch to [API.url](#api) with the options.
      Returns a [Call Object](#call).

  * ### [Async] .post(suburl="", data={}, options={}) __or__ .post(data={}, options={})
      1. If subUrl is setted makes a POST fetch to [API.url](#api)/subUrl with the options and the body of data.
      2. If subUrl is not setted makes a POST fetch to [API.url](#api) with the options and the body of data.
      Returns a [Call Object](#call).

  * ### [Async] .put(suburl="", data={}, options={}) __or__ .put(data={}, options={})
      1. If subUrl is setted makes a PUT fetch to [API.url](#api)/subUrl with the options and the body of data.
      2. If subUrl is not setted makes a PUT fetch to [API.url](#api) with the options and the body of data.
      Returns a [Call Object](#call).

  * ### [Async] .delete(suburl="", data={}, options={}) __or__ .delete(data={}, options={})
      1. If subUrl is setted makes a DELETE fetch to [API.url](#api)/subUrl with the options and the body of data.
      2. If subUrl is not setted makes a DELETE fetch to [API.url](#api) with the options and the body of data.
      Returns a [Call Object](#call).

## Service
  Created from the call of an [API.getService(name)](#-getservice-name--).
  This is used as a middleware between the apiurl and the service you're trying to fetch.
  Example: 
    If API.url="https://example.com/api"
    A service can be: "users"
  * ### Constructor: new Service(url="",service="",api=null).
    No documentation because this is not intended to be used directly. 
    Call API.getService() instead.
  * ### Events: .on(eventName,callback).
    Check [SioEvents](https://github.com/empirreamm/SioEvents) for more details

    |Event|Fire Time|Data|
    |---|---|---|
    |response|Whenever a response from the server is received|[Call Object](#call)
  * ### Methods

    * #### .getService(name).
        Creates a new [Service Object](#service) to the API url/name

    * #### .setHeader(name,value).
        Sets a header to be send to every petition on this Service.

    * #### .removeHeader(name).
        Removes a header from the Service.

    * ### [Async] .get(suburl="",options={}) __or__ .get(options={})
        This is going to use the headers from the caller API and the headers from the Service.

        1. If subUrl is setted makes a GET fetch to [API.url](#api)/${this.service}/suburl with the options.
        2. If subUrl is not setted makes a GET fetch to [API.url](#api)/${this.service} with the options.

        Returns a [Call Object](#call).

    * ### [Async] .post(suburl="", data={}, options={}) __or__ .post(data={}, options={})
        This is going to use the headers from the caller API and the headers from the Service.

        1. If subUrl is setted makes a POST fetch to [API.url](#api)/${this.service}/subUrl with the options and the body of data.
        2. If subUrl is not setted makes a POST fetch to [API.url](#api)/${this.service} with the options and the body of data.

        Returns a [Call Object](#call).

    * ### [Async] .put(suburl="", data={}, options={}) __or__ .put(data={}, options={})
        This is going to use the headers from the caller API and the headers from the Service.

        1. If subUrl is setted makes a PUT fetch to [API.url](#api)/${this.service}/subUrl with the options and the body of data.
        2. If subUrl is not setted makes a PUT fetch to [API.url](#api)/${this.service} with the options and the body of data.

        Returns a [Call Object](#call).

    * ### [Async] .delete(suburl="", data={}, options={}) __or__ .delete(data={}, options={})
        This is going to use the headers from the caller API and the headers from the Service.

        1. If subUrl is setted makes a DELETE fetch to [API.url](#api)/${this.service}/subUrl with the options and the body of data.
        2. If subUrl is not setted makes a DELETE fetch to [API.url](#api)/${this.service} with the options and the body of data.

        Returns a [Call Object](#call).

## Call
  ### Properties
  |Name|Type|Description|
  |---|---|---|
  |url|String|The url the request was made.
  |headers|Object|Object with the headers of the response.
  |blob|Blob|Blob of the body of the response.
  |response|Response|A Response Object with a clone of the fetch response.
  |status|Number|Number status of the response.
  |ok|String|response.ok
  |statusText|String|response.statusText.
  |raw|Any|The computed raw data of the response.
  |data|Any|The computed prefered type of the response (In case of the response being a json this is an object representation of that JSON).

  ### Events
  
  This fires the events "response" in the [Service](#service) and in the [API](#api) listeners. The listeners can change the final properties of this call.
