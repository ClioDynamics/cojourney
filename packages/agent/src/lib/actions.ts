import continue_ from './actions/continue'
import ignore from './actions/ignore'
import wait from './actions/wait'
import { type Action } from './types'

/**
 * A list of tools/actions available to the agent
 */
export const defaultActions: Action[] = [
  continue_,
  wait,
  ignore
]

export function getFormattedActions (actions: Action[]) {
  const formattedActions = actions.map((action) => {
    return `${action.name} - ${action.description}`
  })
  // join into a single string
  return formattedActions.join('\n')
}

export function formatActionNames (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}'`).join(',\n')
}

export function formatActions (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}: ${action.description}'`).join(',\n')
}

export function formatActionConditions (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}: ${action.condition}'`).join(',\n')
}

export function formatActionExamples (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}\n${action.examples.map(
    (example) => example
  ).join('\n'
  )}'`).join(',\n')
}
