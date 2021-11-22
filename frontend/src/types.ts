import Delta from 'quill-delta';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// Interfaces go here:

interface InfoLevel {
  userId: number;
  infoLevel: number;
}

export interface Node {
  id: number;
  name: string;
  image: string;
  imageAlt: string;
  subnodes: number[];
  informationLevels: InfoLevel[];
  editors: number[];
  type: string;
}

export interface Subnode {
  id: number;
  node_id: number;
  name: string;
  informationLevel: number;
  editors: number[];
  type: string;
  content: Delta;
}

export interface Game {
  id: number;
  title: string;
  imgpath: string; //path to image from /public/images/path. includes filetype e.g. .jpg
  // TODO: instead of players, gms and users store an augmented list of users, where each user has an assigned role
  // TODO: store objects rather than IDs?
  nodes: number[];
  players: number[];
  gms: number[];
  users: number[]; // = players + gms, might be a better way to define this
  settings: Record<string, unknown>;
}

export interface User {
  id: number;
  username: string;
  password: string; // FOR NOW
  email: string; // FOR NOW
  games: number[];
  profilePicture?: string;
  images: string[]; // FOR NOW
}

export enum DefaultNodeTypes {
  location,
  organization,
  item,
  person,
}

export enum DefaultSubnodeTypes {
  description,
  notes,
  event,
  linkList,
}
