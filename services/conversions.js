import buffer from "buffer";

const Buffer = buffer.Buffer;

const convert = (from, to) => str => Buffer.from(str, from).toString(to)
export const utf8ToBase64 = convert('utf8', 'base64')

export const base64ToUtf8 = convert('base64', 'utf8')
