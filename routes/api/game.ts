import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, UserModel } from '../../db/models';
import { UserPermission } from '../../frontend/src/types';

export const router = express.Router();

// POST: Create game
router.post('/game', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Creating new game');

  const { userId, title } = req.body;
  const game = new GameModel({
    title,
    nodes: [],
    users: [
      {
        userId,
        permission: UserPermission.gameMaster,
      },
    ],
    settings: {},
    // TODO: use stock images
    // imgpath:
    // image:
  });

  try {
    const result = await game.save();
    await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { games: result._id },
      },
    );
    res.send(result);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// GET: Retrieve a game
router.get('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only games with ids stored in user data can be retrieved for session user

  console.log('Retrieving game');

  try {
    const { id } = req.params;
    const game = await GameModel.findById(id);
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// DELETE: Delete a game
router.delete('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only game with ids in session user data can be deleted

  console.log('Deleting game');

  try {
    const gameId = req.params.id;
    const game = await GameModel.findByIdAndDelete(gameId);
    if (game) {
      // Remove the game ID from every user's list of games
      await Promise.allSettled(
        game.users.map(async (user) => {
          return await UserModel.findByIdAndUpdate(user.userId, {
            $pull: { games: gameId },
          });
        }),
      );
    }
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// PATCH: Update any of the properties of Game
router.patch('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Updating game');

  const { id } = req.params;
  const updates = req.body; // TODO: perform some validation?
  try {
    const game = await GameModel.findByIdAndUpdate(id, updates, { new: true });
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// ----------------------------------- USER-RELATED ENDPOINTS -----------------------------------
// POST: Add player to game
router.post('/game/:id/user', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const { gameId, username } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(404).send('User does not exist in the database.');
      return;
    }

    const alreadyInGame = Boolean(
      await GameModel.findOne({
        _id: gameId,
        users: { $elemMatch: { userId: user._id } },
      }),
    );
    if (alreadyInGame) {
      res.status(422).send('User was already added to the game.');
      return;
    }

    const userPermissionRecord = {
      userId: user._id,
      permission: UserPermission.player,
    };
    await GameModel.findOneAndUpdate(
      { _id: gameId },
      { $push: { users: userPermissionRecord } },
      { returnNewDocument: true },
    );
    res.send(userPermissionRecord);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// TODO: HELP Filip [make sure to consult corresponding mock methods in mock-backend]
// DELETE: Remove player from the game
router.delete('/game/:gameId/user/:userId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO:
  // - delete player from game
  // - delete game from player
  // - delete player from each of the game's node's informationLevels
});

// ----------------------------------- NODE-RELATED ENDPOINTS -----------------------------------
// TODO: HELP Filip
// POST: Add node to game
router.post('/game/:id/node', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// TODO: HELP Filip
// PATCH: Update any of the properties of Node
router.patch('/game/:gameId/user/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// TODO: HELP Filip
// DELETE: Remove node from game
router.delete('/game/:gameId/node/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {});
