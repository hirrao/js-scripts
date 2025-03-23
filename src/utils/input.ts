import inquirer from "inquirer";

export const input = async (message: string) => {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: message,
  });
  return name;
};

export const confirm = async (message: string) => {
  const { choice } = await inquirer.prompt({
    type: "confirm",
    name: "choice",
    message: message,
    default: true,
  });
  return choice;
};
