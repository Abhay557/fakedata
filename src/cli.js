#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { data } = require('../src/index.js');

// ─── ANSI Colors ─────────────────────────────────────────────────────────────
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    magenta: '\x1b[35m',
};

// ─── Help / Banner ───────────────────────────────────────────────────────────
const BANNER = `
${c.cyan}${c.bright}
  ███████╗ █████╗ ██╗  ██╗███████╗██████╗  █████╗ ████████╗ █████╗ 
  ██╔════╝██╔══██╗██║ ██╔╝██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
  █████╗  ███████║█████╔╝ █████╗  ██║  ██║███████║   ██║   ███████║
  ██╔══╝  ██╔══██║██╔═██╗ ██╔══╝  ██║  ██║██╔══██║   ██║   ██╔══██║
  ██║     ██║  ██║██║  ██╗███████╗██████╔╝██║  ██║   ██║   ██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
${c.reset}  ${c.gray}Fake Data Generator | v2.0.2${c.reset}
`;

const HELP = `
${BANNER}
${c.bright}USAGE:${c.reset}
  fakedata <command> [options]

${c.bright}COMMANDS:${c.reset}
  ${c.cyan}generate${c.reset}     Generate synthetic user data
  ${c.cyan}preview${c.reset}      Print a single user profile to the console
  ${c.cyan}help${c.reset}         Show this help message

${c.bright}OPTIONS (for generate):${c.reset}
  ${c.yellow}--count, -n${c.reset}         Number of users to generate         ${c.gray}[default: 10]${c.reset}
  ${c.yellow}--format, -f${c.reset}        Output format: json | csv | flat     ${c.gray}[default: json]${c.reset}
  ${c.yellow}--output, -o${c.reset}        Output file path                     ${c.gray}[default: stdout]${c.reset}
  ${c.yellow}--seed, -s${c.reset}          Random seed for reproducibility      ${c.gray}[default: none]${c.reset}
  ${c.yellow}--locale, -l${c.reset}        Locale: en|in|jp|kr|de|br|ar|fr     ${c.gray}[default: en]${c.reset}
  ${c.yellow}--anomaly-rate, -a${c.reset}  Fraction of anomalous users (0-1)    ${c.gray}[default: 0]${c.reset}
  ${c.yellow}--missing-rate, -m${c.reset}  Fraction of null fields (0-1)        ${c.gray}[default: 0]${c.reset}
  ${c.yellow}--timeseries, -t${c.reset}    Include time-series activity logs     ${c.gray}[flag]${c.reset}
  ${c.yellow}--days${c.reset}              Days of activity for time-series     ${c.gray}[default: 30]${c.reset}
  ${c.yellow}--pretty${c.reset}            Pretty-print JSON output              ${c.gray}[flag]${c.reset}

${c.bright}EXAMPLES:${c.reset}
  ${c.gray}# Generate 1000 users to a CSV file${c.reset}
  fakedata generate -n 1000 -f csv -o dataset.csv

  ${c.gray}# Generate 500 deterministic Indian users${c.reset}
  fakedata generate -n 500 -l in --seed 42 -o india.json

  ${c.gray}# Generate fraud detection dataset with 5% anomalies${c.reset}
  fakedata generate -n 10000 -a 0.05 -f csv -o fraud_data.csv

  ${c.gray}# Preview a single user profile in the console${c.reset}
  fakedata preview

  ${c.gray}# Generate with time-series activity logs${c.reset}
  fakedata generate -n 100 --timeseries --days 60 -o activity.json
`;

// ─── Argument Parser ─────────────────────────────────────────────────────────
function parseArgs(argv) {
    const args = argv.slice(2);
    const opts = {
        command: args[0] || 'help',
        count: 10,
        format: 'json',
        output: null,
        seed: null,
        locale: null,
        anomaly_rate: 0,
        missing_rate: 0,
        timeseries: false,
        days: 30,
        events_per_day: 8,
        pretty: false,
    };

    for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        const next = args[i + 1];
        switch (arg) {
            case '--count': case '-n': opts.count = parseInt(next); i++; break;
            case '--format': case '-f': opts.format = next; i++; break;
            case '--output': case '-o': opts.output = next; i++; break;
            case '--seed': case '-s': opts.seed = parseInt(next); i++; break;
            case '--locale': case '-l': opts.locale = next; i++; break;
            case '--anomaly-rate': case '-a': opts.anomaly_rate = parseFloat(next); i++; break;
            case '--missing-rate': case '-m': opts.missing_rate = parseFloat(next); i++; break;
            case '--timeseries': case '-t': opts.timeseries = true; break;
            case '--days': opts.days = parseInt(next); i++; break;
            case '--events-per-day': opts.events_per_day = parseInt(next); i++; break;
            case '--pretty': opts.pretty = true; break;
            case 'help': case '--help': case '-h': opts.command = 'help'; break;
        }
    }
    return opts;
}

// ─── Commands ────────────────────────────────────────────────────────────────
function cmdPreview() {
    const u = data.user();
    console.log(BANNER);
    console.log(`${c.bright}${c.green}✔ Sample User Profile:${c.reset}\n`);
    console.log(JSON.stringify(u, null, 2));
}

// ─── Streaming CSV header from a single sample user ──────────────────────────
function getCsvHeader() {
    const sample = data.user();
    return Object.keys(sample).map(k => `"${k}"`).join(',');
}

function userToCsvRow(u) {
    return Object.values(u).map(v => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') return `"${JSON.stringify(v).replace(/"/g, '""')}"`;
        if (typeof v === 'string') return `"${v.replace(/"/g, '""')}"`;
        return String(v);
    }).join(',');
}

// ─── Stream one record at a time to keep RAM constant ────────────────────────
function cmdGenerate(opts) {
    const options = {
        seed: opts.seed,
        locale: opts.locale,
        anomaly_rate: opts.anomaly_rate,
        missing_rate: opts.missing_rate,
    };

    const count = opts.count;
    const startTime = Date.now();
    const PROGRESS_INTERVAL = 10000; // report every 10k records

    // ── stdout path (small counts, no file) — keep original behaviour ──────
    if (!opts.output) {
        // For stdout we can afford to buffer (user won't pipe 50M rows to terminal)
        let output;
        if (opts.timeseries) {
            const results = Array.from({ length: count }, () =>
                data.userTimeSeries({ ...options, days: opts.days, eventsPerDay: opts.events_per_day })
            );
            output = opts.pretty ? JSON.stringify(results, null, 2) : JSON.stringify(results);
        } else if (opts.format === 'csv') {
            output = data.usersToCSV(count, options);
        } else if (opts.format === 'flat') {
            const rows = data.usersFlat(count, options);
            output = opts.pretty ? JSON.stringify(rows, null, 2) : JSON.stringify(rows);
        } else {
            output = opts.pretty
                ? data.usersToJSON(count, options)
                : JSON.stringify(data.users(count, options));
        }
        process.stdout.write(output + '\n');
        return;
    }

    // ── File path — STREAMING: open file first, write one record at a time ──
    const outPath = path.resolve(opts.output);
    const stream = fs.createWriteStream(outPath, { encoding: 'utf8' });

    let written = 0;

    const onDone = () => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const sizeBytes = fs.statSync(outPath).size;
        const sizeLabel = sizeBytes >= 1048576
            ? `${(sizeBytes / 1048576).toFixed(1)} MB`
            : `${(sizeBytes / 1024).toFixed(1)} KB`;
        process.stderr.write('\r\x1b[K'); // clear progress line
        console.error(
            `${c.green}${c.bright}✔ Done!${c.reset} ` +
            `Generated ${c.cyan}${count.toLocaleString()}${c.reset} users ` +
            `in ${c.yellow}${elapsed}s${c.reset} ` +
            `→ ${c.magenta}${outPath}${c.reset} ` +
            `(${c.gray}${sizeLabel}${c.reset})`
        );
    };

    stream.on('error', (err) => {
        console.error(`${c.red}✖ Write error:${c.reset} ${err.message}`);
        process.exit(1);
    });

    if (opts.timeseries) {
        // ── Time-series: streaming JSON array ──────────────────────────────
        stream.write('[\n');
        const writeNext = () => {
            let ok = true;
            while (written < count && ok) {
                const rec = data.userTimeSeries({ ...options, days: opts.days, eventsPerDay: opts.events_per_day });
                const comma = written < count - 1 ? ',' : '';
                const line = (opts.pretty ? JSON.stringify(rec, null, 2) : JSON.stringify(rec)) + comma + '\n';
                ok = stream.write(line);
                written++;
                if (written % PROGRESS_INTERVAL === 0) {
                    process.stderr.write(`\r${c.gray}  ⏳ ${written.toLocaleString()} / ${count.toLocaleString()} written...${c.reset}`);
                }
            }
            if (written < count) {
                stream.once('drain', writeNext);
            } else {
                stream.end(']\n', onDone);
            }
        };
        writeNext();

    } else if (opts.format === 'csv') {
        // ── CSV: write header, then one row per user ───────────────────────
        const header = getCsvHeader();
        stream.write(header + '\n');
        const writeNext = () => {
            let ok = true;
            while (written < count && ok) {
                const u = data.user(options);
                ok = stream.write(userToCsvRow(u) + '\n');
                written++;
                if (written % PROGRESS_INTERVAL === 0) {
                    process.stderr.write(`\r${c.gray}  ⏳ ${written.toLocaleString()} / ${count.toLocaleString()} written...${c.reset}`);
                }
            }
            if (written < count) {
                stream.once('drain', writeNext);
            } else {
                stream.end(onDone);
            }
        };
        writeNext();

    } else {
        // ── JSON / flat: streaming JSON array ─────────────────────────────
        stream.write('[\n');
        const writeNext = () => {
            let ok = true;
            while (written < count && ok) {
                const u = opts.format === 'flat' ? data.user(options) : data.user(options);
                const comma = written < count - 1 ? ',' : '';
                const line = (opts.pretty ? JSON.stringify(u, null, 2) : JSON.stringify(u)) + comma + '\n';
                ok = stream.write(line);
                written++;
                if (written % PROGRESS_INTERVAL === 0) {
                    process.stderr.write(`\r${c.gray}  ⏳ ${written.toLocaleString()} / ${count.toLocaleString()} written...${c.reset}`);
                }
            }
            if (written < count) {
                stream.once('drain', writeNext);
            } else {
                stream.end(']\n', onDone);
            }
        };
        writeNext();
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
    const opts = parseArgs(process.argv);

    switch (opts.command) {
        case 'generate': cmdGenerate(opts); break;
        case 'preview': cmdPreview(); break;
        case 'help': default: console.log(HELP); break;
    }
}

main();
