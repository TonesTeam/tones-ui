import { useState } from 'react';
import { StepDTO, StepBatchDTO } from 'common/dto/step.dto';

/**
 * Custom hook for managing step batches in protocol constructor
 * Handles creation, modification, and deletion of step batches
 */
export const useStepBatches = (initialBatches: StepBatchDTO[] = []) => {
    const [stepBatches, setStepBatches] =
        useState<StepBatchDTO[]>(initialBatches);

    /**
     * Creates a new empty step batch
     */
    const addNewStepBatch = () => {
        const newBatchId =
            stepBatches.length === 0
                ? 1
                : Math.max(...stepBatches.map((b) => b.id)) + 1;

        const newBatch: StepBatchDTO = {
            id: newBatchId,
            sequenceNumber: stepBatches.length + 1,
            steps: [],
        };

        setStepBatches([...stepBatches, newBatch]);
    };

    /**
     * Adds a new step to the protocol
     * Creates a new batch if none exist, otherwise adds to the first batch
     */
    const addBlock = (newBlock: StepDTO) => {
        const allSteps = stepBatches.flatMap((b) => b.steps);
        const newID =
            allSteps.length == 0
                ? 0
                : allSteps.length == 1
                ? 1
                : allSteps.reduce((prev, current) =>
                      prev && prev.id > current.id ? prev : current,
                  ).id + 1;

        const newStep = {
            type: newBlock.type,
            id: newBlock.id == -1 ? newID : newBlock.id,
            sequenceNumber: allSteps.length + 1,
            params: newBlock.params,
        } as StepDTO;

        // Add to first batch or create new one
        if (stepBatches.length === 0) {
            setStepBatches([
                {
                    id: 1,
                    sequenceNumber: 1,
                    steps: [newStep],
                },
            ]);
        } else {
            const updatedBatches = [...stepBatches];
            updatedBatches[0] = {
                ...updatedBatches[0],
                steps: [...updatedBatches[0].steps, newStep],
            };
            setStepBatches(updatedBatches);
        }
    };

    /**
     * Deletes a step from all batches
     * Removes empty batches after deletion
     */
    const deleteBlock = (blockToRemove: StepDTO) => {
        const updatedBatches = stepBatches
            .map((batch) => ({
                ...batch,
                steps: batch.steps.filter(
                    (step) => step.id !== blockToRemove.id,
                ),
            }))
            .filter((batch) => batch.steps.length > 0);
        setStepBatches(updatedBatches);
    };

    /**
     * Updates the order of steps in a batch
     * Recalculates sequence numbers after reordering
     */
    const handleBlocksChange = (newSteps: StepDTO[]) => {
        if (stepBatches.length > 0) {
            const updatedSteps = newSteps.map((step, index) => ({
                ...step,
                sequenceNumber: index + 1,
            }));
            setStepBatches([
                {
                    ...stepBatches[0],
                    steps: updatedSteps,
                },
            ]);
        }
    };

    /**
     * Adds multiple steps to the last batch
     * Creates a new batch if none exist
     */
    const addStepsToLastBatch = (steps: StepDTO[]) => {
        if (stepBatches.length === 0) {
            setStepBatches([
                {
                    id: 1,
                    sequenceNumber: 1,
                    steps: steps,
                },
            ]);
        } else {
            const updatedBatches = [...stepBatches];
            const lastBatch = updatedBatches[updatedBatches.length - 1];
            lastBatch.steps = [...lastBatch.steps, ...steps];
            setStepBatches(updatedBatches);
        }
    };

    return {
        stepBatches,
        setStepBatches,
        addNewStepBatch,
        addBlock,
        deleteBlock,
        handleBlocksChange,
        addStepsToLastBatch,
    };
};
