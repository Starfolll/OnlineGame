"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("./command"));
const chalk_1 = __importDefault(require("chalk"));
const readline_sync_1 = __importDefault(require("readline-sync"));
const logLetters_1 = __importDefault(require("../scripts/utils/consoleLogs/logLetters"));
class CommandsSections {
    constructor(commandsSections) {
        var _a, _b;
        this.name = commandsSections.name;
        this.deep = (_a = commandsSections.deep, (_a !== null && _a !== void 0 ? _a : 1));
        this.header = (_b = commandsSections.header, (_b !== null && _b !== void 0 ? _b : ""));
        this.sections = {};
        if (!!commandsSections.sections)
            for (const section in commandsSections.sections)
                this.sections[section] = new CommandsSections((Object.assign(Object.assign({}, commandsSections.sections[section]), { header: this.header, deep: this.deep + 1 })));
        this.commands = {};
        if (!!commandsSections.commands)
            for (const command in commandsSections.commands)
                this.commands[command] = new command_1.default((Object.assign(Object.assign({}, commandsSections.commands[command]), { deep: this.deep + 1 })));
    }
    ShowTitle() {
        console.log(` ${"|-".repeat(this.deep)} > ${chalk_1.default.underline.blueBright(this.name)} <`);
    }
    ShowSectionTitle() {
        console.log(` ${"|-".repeat(this.deep)} ${chalk_1.default.blueBright(this.name)}`);
    }
    Show() {
        console.log();
        this.ShowTitle();
        if (Object.keys(this.sections).length > 0)
            console.log();
        Object.keys(this.sections).forEach(s => this.sections[s].ShowSectionTitle());
        if (Object.keys(this.commands).length > 0)
            console.log();
        Object.keys(this.commands).forEach(c => this.commands[c].Show());
        console.log();
    }
    SpawnCommand(commandName) {
        const command = this.commands[commandName];
        if (!command)
            return console.error(" | No such command");
        else
            command.Execute();
    }
    EnterSection(sectionName, onSectionQuit) {
        const section = this.sections[sectionName];
        if (!section)
            return console.error(" | No such section");
        else
            section.Enter(onSectionQuit);
    }
    Enter(onSectionQuit) {
        const quitSection = () => {
            console.clear();
            if (!!this.header)
                logLetters_1.default(this.header);
            this.Show();
        };
        quitSection();
        while (true) {
            const input = readline_sync_1.default.question(chalk_1.default.magentaBright(` ${"|-".repeat(this.deep + 1)}> `));
            if (!input)
                continue;
            if (input === "q") {
                onSectionQuit();
                break;
            }
            if (input === "c") {
                quitSection();
                continue;
            }
            if (input[0] === "-")
                this.SpawnCommand(input);
            else
                this.EnterSection(input, quitSection);
        }
    }
}
exports.default = CommandsSections;
