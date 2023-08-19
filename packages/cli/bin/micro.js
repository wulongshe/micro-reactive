#!/usr/bin/env node
const Command = require('../scripts/Command')
const create = require('../scripts/create')

Command.create().then(create)
