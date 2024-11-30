import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button } from "@mui/material";
import { produce } from "immer";
import { useAtom, useAtomValue } from "jotai";
import { FC, memo, useEffect } from "react";
import { gridGameAtom } from "../../../atoms/gridGame";
import { isEditingAtom } from "../../../atoms/isEditing";
import { Column } from "./Column/Column";

export const QuestionGrid: FC = memo(() => {
  const [grid, setGrid] = useAtom(gridGameAtom);
  const isEditing = useAtomValue(isEditingAtom);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const origin = location.initial.dropTargets[0];
        const destination = location.current.dropTargets[0];

        setGrid(
          produce((draft) => {
            if (origin) {
              draft[Number(origin.data.categoryIndex)].questions[
                Number(origin.data.questionIndex)
              ] = "";
            }

            if (destination) {
              draft[Number(destination.data.categoryIndex)].questions[
                Number(destination.data.questionIndex)
              ] = String(source.data.questionId);
            }
          })
        );
      },
    });
  }, []);

  return (
    <>
      <div style={{ display: "flex", columnGap: "1rem" }}>
        {grid.map(({ category, questions }, index) => (
          <Column
            key={index}
            category={category}
            questions={questions}
            categoryIndex={index}
          />
        ))}
      </div>

      {isEditing && (
        <Button
          onClick={() =>
            setGrid((prevColumns) => [
              ...prevColumns,
              { category: "", questions: ["", "", "", "", ""] },
            ])
          }
        >
          Add Column
        </Button>
      )}
    </>
  );
});
