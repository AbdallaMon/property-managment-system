import {cookies} from "next/headers";
import {jwtVerify} from 'jose';

export async function getUserProperties() {
    const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const {payload} = await jwtVerify(token, SECRET_KEY);
    return payload.properties
}

export async function updateWhereClauseWithUserProperties(key, where) {

    const properties = await getUserProperties()
    if (properties && properties.length > 0) {
        const propertyIds = [];
        properties.forEach((prop) => {
            propertyIds.push(prop.propertyId)
        })

        where[key] = {in: propertyIds}
    }
    return where

}

export async function checkIfIdAllowed(id) {
    const properties = await getUserProperties()
    let isAllowed = properties.find(({propertyId}) => propertyId == id)
    if (!properties || properties.length === 0) isAllowed = true
    if (isAllowed) return true;
    return false
}