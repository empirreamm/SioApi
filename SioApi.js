import SioEvents from "https://unpkg.com/sioevents";
class Call{
  constructor(url,options,service){
    this.service=service;
    this.url=url;
    this.options=options;
    this.headers={};
    Object.defineProperties(this, 
      {
        response: {
          value:null,
          writable:true
        }
      }
    );
  }
  async request(){
    let response = await fetch(this.url,this.options);
    response.headers.forEach((value,key)=>{
      this.headers[key]=value;
    });
    this.blob = await response.clone().blob();
    this.response=response.clone();
    this.status=response.status;
    this.statusText=response.statusText;
    this.ok=response.ok;
    Object.assign(this, response.clone());
    await this.processResponse(this.blob);
    this.service.emit("response",this);
    return this;
  }
  async processResponse(blob){
    let type=blob.type.split("/");
    this.mimeType={
      type:type[0],
      subtype:type[1]
    }
    switch(this.mimeType.type){
      case "text":
        this.data=await blob.text();
        this.raw=this.data;
        break;
      case "image":
        this.data=URL.createObjectURL(blob);
        this.raw=blob;
        break;
      case "application":
        switch(this.mimeType.subtype){
          case "json":
            this.raw = await blob.text();
            this.data = JSON.parse(this.raw);
            break;
          default:
            this.data=blob;
            this.raw=blob;
        }
        break;
      default:
        this.data=blob;
        this.raw=blob;
        break;
    }
    return true;
  }
}
class Service extends SioEvents{
  constructor(url="",service="",api=null){
    super();
    this.url = url.replace(/\/$/,"");
    this.service = service.replace(/^\//,"").replace(/\/$/,"");
    this.api=api;
    this.headers={};
    this.on("*",(event)=>{
      this.api.emit(event);
    });
  }
  async parseData(data){
    let type=typeof data;
    let result={
      contentType:null,
      data:null,
    }
    if(data instanceof FormData){
      result.contentType="multipart/form-data";
      result.data=data;
      return result;
    }
    if(data instanceof File){
      result.contentType=data.type??"application/octet-stream";
      return new Promise(
        (resolve,reject)=>{
          let reader = new FileReader();
          reader.onload = () => {
            result.data=reader.result;
            resolve(result);
          };
          reader.readAsText(data);
        }
      );
    }
    if(type=="object"){
      result.contentType="application/json";
      result.data=JSON.stringify(data);
      return result;
    }
    result.contentType="text/plain";
    result.data=data;
    return result;
  }
  async request(subUrl="",options={}){
    let url=this.url;
    if(subUrl){
      url+=`/${subUrl}`;
    }
    let call=new Call(url,options,this);
    return await call.request();
  }
  async get(subUrl="",options={}){
    if(typeof subUrl=="object"){
      options=subUrl;
      subUrl="";
    }else if(typeof subUrl=="string"){
      subUrl=subUrl.replace(/^\//,"").replace(/\/$/,"");
      subUrl="/"+subUrl;
      subUrl=subUrl.replace(/\/\//,"");
    }else{
      subUrl="";
    }
    let qry=typeof options.qry=="object"?options.qry:{};
    delete options.qry;
    let headers=Object.assign({},this.api.headers,this.headers,options.headers);
    delete options.headers;
    let opts=Object.assign(
      {
        method: 'GET',
        headers: headers,
      },
      options
    );
    opts.method = 'GET';
    let isQry=Object.keys(qry).length>0;
    qry=isQry?("?"+Object.keys(qry).map(key=>key+"="+qry[key]).join("&")):"";
    return await this.request(subUrl+qry,opts);
  }
  async post(suburl="",data={},options={}){
    if(typeof suburl=="object"){
      options=data;
      data=suburl;
      suburl="";
    }else if(typeof suburl=="string"){
      suburl=suburl.replace(/^\//,"").replace(/\/$/,"");
      suburl="/"+suburl;
      subUrl=subUrl.replace(/\/\//,"");
    }else{
      suburl="";
    }
    let dataParsed=await this.parseData(data);
    data=dataParsed.data;
    let headers=Object.assign({},this.api.headers,this.headers,options.headers);
    delete options.headers;
    if(dataParsed.contentType){
      headers["Content-Type"]=dataParsed.contentType;
    }
    let opts=Object.assign(
      {
        method: 'POST',
        headers: headers,
        body: data
      },
      options
    );
    opts.method = 'POST';
    let url=`${this.url}/${this.service}${suburl}`;
    let call=new Call(url,opts,this);
    return await call.request();
  }
  async put(suburl="",data={},options={}){
    if(typeof suburl=="object"){
      options=data;
      data=suburl;
      suburl="";
    }else if(typeof suburl=="string"){
      suburl=suburl.replace(/^\//,"").replace(/\/$/,"");
      suburl="/"+suburl;
      subUrl=subUrl.replace(/\/\//,"");
    }else{
      suburl="";
    }
    let dataParsed=await this.parseData(data);
    data=dataParsed.data;
    let headers=Object.assign({},this.parent.headers,this.headers,options.headers);
    delete options.headers;
    if(dataParsed.contentType){
      headers["Content-Type"]=dataParsed.contentType;
    }
    let opts=Object.assign(
      {
        method: 'PUT',
        headers: headers,
        body: data
      },
      options
    );
    opts.method = 'PUT';
    let url=`${this.url}/${this.service}${suburl}`;
    let call=new Call(url,opts,this);
    return await call.request();
  }
  async delete(suburl="",data={},options={}){
    if(typeof suburl=="object"){
      options=data;
      data=suburl;
      suburl="";
    }else if(typeof suburl=="string"){
      suburl=suburl.replace(/^\//,"").replace(/\/$/,"");
      suburl="/"+suburl;
      subUrl=subUrl.replace(/\/\//,"");
    }else{
      suburl="";
    }
    let dataParsed=await this.parseData(data);
    data=dataParsed.data;
    let headers=Object.assign({},this.parent.headers,this.headers,options.headers);
    delete options.headers;
    if(dataParsed.contentType){
      headers["Content-Type"]=dataParsed.contentType;
    }
    let opts=Object.assign(
      {
        method: 'DELETE',
        headers: headers,
        body: data
      },
      options
    );
    opts.method = 'DELETE';
    let url=`${this.url}/${this.service}${suburl}`;
    let call=new Call(url,opts,this);
    return await call.request();
  }
  setHeader(key,value){
    this.headers[key]=value;
  }
  removeHeader(key){
    delete this.headers[key];
  }
}
class SioApi extends SioEvents{
  constructor(url=""){
    super();
    this.url = url;
    this.headers={};
  }
  getService(service){
    return new Service(this.url,service,this);
  }
  setHeader(name,value){
    this.headers[name]=value;
  }
  removeHeader(name){
    delete this.headers[name];
  }
  get(subUrl="",options={}){
    return this.getService("").get(subUrl,options);
  }
  post(subUrl="",data={},options={}){
    return this.getService("").post(subUrl,data,options);
  }
  put(subUrl="",data={},options={}){
    return this.getService("").put(subUrl,data,options);
  }
  delete(subUrl="",data={},options={}){
    return this.getService("").delete(subUrl,data,options);
  }
}
export default SioApi;