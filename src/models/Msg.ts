export interface IMsg {
    _id: string,
    sender: string,
    content: string,
    name: string,
    likes?: string[],
    date: string
}