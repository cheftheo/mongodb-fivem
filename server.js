const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');

const exportDocument = (document) => {
    if (!document) return;
    if (document._id && typeof document._id !== "string") {
        document._id = document._id.toString();
    }
    return document;
};

const exportDocuments = (documents) => {
    if (!Array.isArray(documents)) return;
    return documents.map((document => exportDocument(document)));
}

class mongodb_driver {
    connData = { url: "mongodb://localhost:27017", dbName: "mds" };
    static client;
    static connected = false;
    static logs = false;
    static logsArgs = false;
    
    constructor() {
        this.client = new MongoClient(this.connData.url);
    }

    async connect() {
        try { 
            await this.client.connect();
            this.connected = true;
            emit("onDatabaseConnect", this.connData.dbName);

            console.log(`^2[@mongo] Connected successfully to server [db='${this.connData.dbName}'] ^0`);
        } catch (err) { 
            console.log(err.stack); 
        }
    }

    async close() {
        await this.client.close();
    }

    async isDbConnected() {
        return await this.client.isConnected();
    }

    static get isConnected() {
        return this.connected;
    }

    static toggleLogs() {
        this.logs = !this.logs;
        console.log(`^2[@mongo] live logs are now ${this.logs ? "enabled" : "disabled"} ^0`);
    }

    static toggleLogsArgs() {
        this.logsArgs = !this.logsArgs;
        console.log(`^2[@mongo] live logs with ^1@args ^2are now ${this.logsArgs ? "enabled" : "disabled"} ^0`);
    }

    static handleCallback(callback, ...args) {
        if (typeof callback === 'function') callback(...args);
    }

    static isObjEmpty(obj) {
        if (obj == undefined) return true;
        return Object.keys(obj).length === 0;
    }
}

const mds_mongo = new mongodb_driver();

(async () => {
    try {
        await mds_mongo.connect()
    } catch (error) {
        console.log(error)
    }
})()

exports("isConnected", () => {
    return mds_mongo.isConnected()
})

RegisterCommand("mongologger", (src, args) => {
    if (src == 0) mongodb_driver.toggleLogs();

    const type = args[0];
    if (type) mongodb_driver.toggleLogsArgs();
});

// function wait(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

const dbFind = async (params, callback) => {
    // if (!mds_mongo.isConnected) {
    //     console.log("[@mongo] not connected, waiting for connection...");
    //     while (!mds_mongo.isConnected) {
    //         await wait(1000);
    //     }
    // }

    try {
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        if (mongodb_driver.isObjEmpty(params.query)) delete params.query;

        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();

        const result = await col.find(params.query, options).toArray();
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbFind query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");
        
        mongodb_driver.handleCallback(callback, true, exportDocuments(result));
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("find", dbFind)

const dbFindOne = async (params, callback) => {
    try {
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        if (mongodb_driver.isObjEmpty(params.query)) delete params.query;

        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.findOne(params.query, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbFindOne query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, [result]);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("findOne", dbFindOne)

const dbFindMany = async (params, callback) => {
    try {
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.find(query, options).toArray();
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbFindMany query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, exportDocuments(result));
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("findMany", dbFindMany)

const dbInsertOne = async (params, callback) => {
    try {
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};
        const document = params.document || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.insertOne(document, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbInsertOne query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
} 

exports("insertOne", dbInsertOne)

const dbInsertMany = async (params, callback) => {
    try {
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};
        const documents = params.document || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.insertMany(documents, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 2[@mongo]^0 dbInsertMany query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        let arrayOfIds = {};
        for (let key in result.insertedIds) {
            if (result.insertedIds.hasOwnProperty(key)) {
                arrayOfIds[parseInt(key)] = result.insertedIds[key].toString();
            }
        }

        mongodb_driver.handleCallback(callback, true, result.insertedCount, arrayOfIds);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("insertMany", dbInsertMany)

const dbUpdateOne = async (params, callback) => {
    try {
        // const { collection, query, update, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};
        const update = params.update || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.updateOne(query, update, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbUpdateOne query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("updateOne", dbUpdateOne)

const dbUpdate = async (params, callback) => {
    try {
        // const { collection, query, update, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};
        const update = params.update || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.updateOne(query, update, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbUpdateOne query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("update", dbUpdate)

const dbUpdateMany = async (params, callback) => {
    try {
        // const { collection, query, update, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};
        const update = params.update || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.updateMany(query, update, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbUpdateMany query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("updateMany", dbUpdateMany)

const dbDeleteOne = async (params, callback) => {
    try {
        // const { collection, query, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.deleteOne(query, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbDeleteOne query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("deleteOne", dbDeleteOne)

const dbDeleteMany = async (params, callback) => {
    try {
        // const { collection, query, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.deleteMany(query, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbDeleteMany query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("deleteMany", dbDeleteMany)

const dbAggregate = async (params, callback) => {
    try {
        // const { collection, pipeline, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.aggregate(pipeline, options).toArray();
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbAggregate query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("aggregate", dbAggregate)

const dbCountDocuments = async (params, callback) => {
    try {
        // const { collection, query, options } = params;
        if (params.collection == undefined) return console.log("[@mongo] collection is undefined ", mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        const collection = params.collection;
        const query = params.query || {};
        const options = params.options || {};

        const db = mds_mongo.client.db(mds_mongo.connData.dbName);
        const col = db.collection(collection);
        const t0 = performance.now();
        const result = await col.countDocuments(query, options);
        const t1 = performance.now();

        if (mongodb_driver.logs) console.log(`^2[@mongo]^0 dbCountDocuments query: ${(t1 - t0).toFixed(2)} ms`, mongodb_driver.logsArgs ? JSON.stringify(params) : "");

        mongodb_driver.handleCallback(callback, true, result);
    } catch (error) {
        console.log("[@mongo] ", error)
    }
}

exports("count", dbCountDocuments)