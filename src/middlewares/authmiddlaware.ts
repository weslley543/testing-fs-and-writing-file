import jwt from 'jsonwebtoken';
import authConfig from '../config/authconfig';
import { Request, Response, NextFunction } from 'express'
import { promisify } from 'util';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.status(401).json({ msg: 'Token not provided !!' });
  }


  const [, token] = req.headers.authorization.split(' ');

  jwt.verify(token, authConfig.secret, (err, decoded)=> {
      if(err){
        return res.status(401).json('invalid token');
      }
      req.body.id= decoded.id;
      req.body.email = decoded.email;
      return next();
  });
};
