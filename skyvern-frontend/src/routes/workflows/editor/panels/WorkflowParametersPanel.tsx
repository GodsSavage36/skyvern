import { useState } from "react";
import { useWorkflowParametersState } from "../useWorkflowParametersState";
import { WorkflowParameterAddPanel } from "./WorkflowParameterAddPanel";
import { ParametersState } from "../FlowRenderer";
import { WorkflowParameterEditPanel } from "./WorkflowParameterEditPanel";
import { MixerVerticalIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { GarbageIcon } from "@/components/icons/GarbageIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WORKFLOW_EDIT_PANEL_WIDTH = 20 * 16;
const WORKFLOW_EDIT_PANEL_GAP = 1 * 16;

function WorkflowParametersPanel() {
  const [workflowParameters, setWorkflowParameters] =
    useWorkflowParametersState();
  const [operationPanelState, setOperationPanelState] = useState<{
    active: boolean;
    operation: "add" | "edit";
    parameter?: ParametersState[number] | null;
    type: "workflow" | "credential";
  }>({
    active: false,
    operation: "add",
    parameter: null,
    type: "workflow",
  });

  return (
    <div className="relative w-[25rem] rounded-xl border border-slate-700 bg-slate-950 p-5 shadow-xl">
      <div className="space-y-4">
        <header>
          <h1 className="text-lg">Workflow Parameters</h1>
          <span className="text-sm text-slate-400">
            Create placeholder values that you can link in nodes. You will be
            prompted to fill them in before running your workflow.
          </span>
        </header>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              <PlusIcon className="mr-2 h-6 w-6" />
              Add Parameter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>Add Parameter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOperationPanelState({
                  active: true,
                  operation: "add",
                  type: "workflow",
                });
              }}
            >
              Workflow Parameter
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOperationPanelState({
                  active: true,
                  operation: "add",
                  type: "credential",
                });
              }}
            >
              Credential Parameter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <section className="space-y-2">
          {workflowParameters.map((parameter) => {
            return (
              <div
                key={parameter.key}
                className="flex items-center justify-between rounded-md bg-slate-elevation1 px-3 py-2"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm">{parameter.key}</span>
                  {parameter.parameterType === "workflow" ? (
                    <span className="text-sm text-slate-400">
                      {parameter.dataType}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">
                      {parameter.parameterType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MixerVerticalIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setOperationPanelState({
                        active: true,
                        operation: "edit",
                        parameter: parameter,
                        type: parameter.parameterType,
                      });
                    }}
                  />
                  <Dialog>
                    <DialogTrigger>
                      <GarbageIcon className="size-4 cursor-pointer text-destructive-foreground text-red-600" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This parameter will be deleted.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setWorkflowParameters(
                              workflowParameters.filter(
                                (p) => p.key !== parameter.key,
                              ),
                            );
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </section>
      </div>
      {operationPanelState.active && (
        <div
          className="absolute"
          style={{
            top: 0,
            left: -1 * (WORKFLOW_EDIT_PANEL_WIDTH + WORKFLOW_EDIT_PANEL_GAP),
          }}
        >
          {operationPanelState.operation === "add" && (
            <div className="w-80 rounded-xl border border-slate-700 bg-slate-950 p-5 shadow-xl">
              <WorkflowParameterAddPanel
                type={operationPanelState.type}
                onSave={(parameter) => {
                  setWorkflowParameters([...workflowParameters, parameter]);
                  setOperationPanelState({
                    active: false,
                    operation: "add",
                    type: "workflow",
                  });
                }}
                onClose={() => {
                  setOperationPanelState({
                    active: false,
                    operation: "add",
                    type: "workflow",
                  });
                }}
              />
            </div>
          )}
          {operationPanelState.operation === "edit" &&
            operationPanelState.parameter && (
              <div className="w-80 rounded-xl border border-slate-700 bg-slate-950 p-5 shadow-xl">
                <WorkflowParameterEditPanel
                  type={operationPanelState.type}
                  initialValues={operationPanelState.parameter}
                  onSave={(editedParameter) => {
                    setWorkflowParameters(
                      workflowParameters.map((parameter) => {
                        if (
                          parameter.key === operationPanelState.parameter?.key
                        ) {
                          return editedParameter;
                        }
                        return parameter;
                      }),
                    );
                    setOperationPanelState({
                      active: false,
                      operation: "edit",
                      parameter: null,
                      type: "workflow",
                    });
                  }}
                  onClose={() => {
                    setOperationPanelState({
                      active: false,
                      operation: "edit",
                      parameter: null,
                      type: "workflow",
                    });
                  }}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export { WorkflowParametersPanel };