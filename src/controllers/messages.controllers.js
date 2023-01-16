import db from "../database/db.js";

export async function postMessage(req, res) {

}

export async function getMessages(req, res) {
    try{
        const messages = await db.
        collection('messages').find().toArray();
        res.status(200).send(messages);
    } catch (error){
        console.log(error);
        res.status(500).send(error.message);
    }
}