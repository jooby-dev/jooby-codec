interface Command {
    id: number
}

const getCommandsById = ( commands: object ) => (
    Object.fromEntries(Object.entries(commands).map(([, command]) => [(command as Command).id, command]))
);

export default getCommandsById;
