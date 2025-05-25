import { api, atom, injectPromise, injectSignal } from '@zedux/react';
import { produce } from 'immer';

import { trpc } from '../trpc';

export const allGridGamesQueryAtom = atom('allGridGames', () => {
  const gridGamesPromise = injectPromise(
    () => trpc.gridGame.getMyGridGames.query(),
    [],
  );

  return gridGamesPromise;
});

export const gridGameAtom = atom('gridGame', () => {
  const gridGame = injectSignal({
    grid: [{ category: '', questions: ['', '', '', '', ''] }],
    gridGameId: '',
    title: '',
  });

  const editCategoryTitle = (categoryIndex: number, title: string) => {
    gridGame.set(
      produce((draft) => {
        draft.grid[categoryIndex].category = title;
      }),
    );
  };

  const popQuestion = (categoryIndex: number) => {
    gridGame.set(
      produce((draft) => {
        draft.grid[categoryIndex].questions.pop();
      }),
    );
  };

  const pushQuestion = (categoryIndex: number) => {
    gridGame.set(
      produce((draft) => {
        draft.grid[categoryIndex].questions.push('');
      }),
    );
  };

  const moveQuestion = (
    questionId: string,
    origin?: { categoryIndex: number; questionIndex: number },
    destination?: { categoryIndex: number; questionIndex: number },
  ) => {
    gridGame.set(
      produce((draft) => {
        if (origin) {
          draft.grid[origin.categoryIndex].questions[origin.questionIndex] = '';
        }

        if (destination) {
          draft.grid[destination.categoryIndex].questions[
            destination.questionIndex
          ] = questionId;
        }
      }),
    );
  };

  const changeTitle = (title: string) => {
    gridGame.set(
      produce((draft) => {
        draft.title = title;
      }),
    );
  };

  const popColumn = () => {
    gridGame.set(
      produce((draft) => {
        draft.grid.pop();
      }),
    );
  };

  const pushColumn = () => {
    gridGame.set(
      produce((draft) => {
        draft.grid.push({
          category: '',
          questions: ['', '', '', '', ''],
        });
      }),
    );
  };

  return api(gridGame).setExports({
    changeTitle,
    editCategoryTitle,
    moveQuestion,
    popColumn,
    popQuestion,
    pushColumn,
    pushQuestion,
  });
});
