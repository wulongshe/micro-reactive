#!/usr/bin/env node
const Command = require('../scripts/command')
const create = require('../scripts/create')

Command.create().then(create)
