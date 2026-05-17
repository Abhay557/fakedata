#!/usr/bin/env python3
"""
fakedata CLI - ML-Ready Synthetic Data Engine
"""
import argparse
import json
import sys
import time
import os

def main():
    parser = argparse.ArgumentParser(
        prog='fakedata',
        description='fakedata - ML-Ready Synthetic Data Engine (Python)',
        formatter_class=argparse.RawTextHelpFormatter,
        epilog="""
EXAMPLES:
  # Generate 1000 users to a CSV file
  fakedata generate -n 1000 -f csv -o dataset.csv

  # Generate 500 deterministic Indian users
  fakedata generate -n 500 -l in --seed 42 -o india.json

  # Generate fraud detection dataset with 5%% anomalies
  fakedata generate -n 10000 -a 0.05 -f csv -o fraud_data.csv

  # Generate 500 standalone company profiles
  fakedata generate --type companies -n 500 -o companies.json

  # Preview a single user profile
  fakedata preview

  # Generate with time-series activity logs
  fakedata generate -n 100 --timeseries --days 60 -o activity.json
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='Command to run')

    # ─── preview ──────────────────────────────────────────────────────────────
    subparsers.add_parser('preview', help='Print a single user profile to the console')

    # ─── generate ─────────────────────────────────────────────────────────────
    gen = subparsers.add_parser('generate', help='Generate synthetic user data')
    gen.add_argument('-T', '--type', type=str, choices=['users', 'companies', 'jobs', 'universities', 'transactions', 'medical_records'], default='users',
                     help='Type of data to generate (default: users)')
    gen.add_argument('-n', '--count', type=int, default=10,
                     help='Number of users to generate (default: 10)')
    gen.add_argument('-f', '--format', choices=['json', 'csv', 'flat'], default='json',
                     help='Output format: json | csv | flat (default: json)')
    gen.add_argument('-o', '--output', type=str, default=None,
                     help='Output file path (default: stdout)')
    gen.add_argument('-s', '--seed', type=int, default=None,
                     help='Random seed for reproducibility')
    gen.add_argument('-l', '--locale', type=str, default=None,
                     help='Locale: en|in|jp|kr|de|br|ar|fr (default: en)')
    gen.add_argument('-a', '--anomaly-rate', type=float, default=0.0,
                     help='Fraction of anomalous users 0-1 (default: 0)')
    gen.add_argument('-m', '--missing-rate', type=float, default=0.0,
                     help='Fraction of null fields 0-1 (default: 0)')
    gen.add_argument('-t', '--timeseries', action='store_true',
                     help='Include time-series activity logs')
    gen.add_argument('--days', type=int, default=30,
                     help='Days of activity for time-series (default: 30)')
    gen.add_argument('--events-per-day', type=int, default=8,
                     help='Average events per day for time-series (default: 8)')
    gen.add_argument('--pretty', action='store_true',
                     help='Pretty-print JSON output')

    args = parser.parse_args()

    if args.command is None or args.command == 'help':
        parser.print_help()
        return

    # ─── Import the engine (lazy, only when needed) ───────────────────────────
    try:
        import fakedata.modules.data as data
    except ImportError:
        print("ERROR: Could not import fakedata. Make sure it is installed: pip install fakedata-python", file=sys.stderr)
        sys.exit(1)

    # ─── Preview ─────────────────────────────────────────────────────────────
    if args.command == 'preview':
        u = data.user()
        print(json.dumps(u, indent=2))
        return

    # ─── Generate ────────────────────────────────────────────────────────────
    if args.command == 'generate':
        options = {
            'seed': args.seed,
            'locale': args.locale,
            'anomaly_rate': args.anomaly_rate,
            'missing_rate': args.missing_rate,
        }
        options = {k: v for k, v in options.items() if v is not None and v != 0.0}

        count = args.count
        start = time.time()
        PROGRESS_INTERVAL = 10000

        # ── stdout: buffer is fine for small terminal output ──────────────
        if not args.output:
            if args.timeseries:
                results = [
                    data.user_time_series({**options, 'days': args.days, 'events_per_day': args.events_per_day})
                    for _ in range(count)
                ]
                print(json.dumps(results, indent=2 if args.pretty else None))
            elif args.type != 'users':
                if args.type == 'companies': rows = data.companies_gen(count)
                elif args.type == 'jobs': rows = data.jobs_gen(count)
                elif args.type == 'universities': rows = data.universities_gen(count)
                elif args.type == 'transactions': rows = data.transactions_gen(count)
                elif args.type == 'medical_records': rows = data.medical_records(count)
                print(json.dumps(rows, indent=2 if args.pretty else None))
            elif args.format == 'csv':
                print(data.users_to_csv(count, options if options else None))
            elif args.format == 'flat':
                rows = data.users_flat(count, options if options else None)
                print(json.dumps(rows, indent=2 if args.pretty else None))
            else:
                if args.pretty:
                    print(data.users_to_json(count, options if options else None))
                else:
                    print(json.dumps(data.users(count, options if options else None)))
            return

        # ── File: STREAMING — open file first, write one record at a time ──
        out_path = os.path.abspath(args.output)

        with open(out_path, 'w', encoding='utf-8') as f:

            if args.timeseries:
                f.write('[\n')
                for i in range(count):
                    rec = data.user_time_series({**options, 'days': args.days, 'events_per_day': args.events_per_day})
                    line = json.dumps(rec, indent=2 if args.pretty else None)
                    f.write(line + (',' if i < count - 1 else '') + '\n')
                    if (i + 1) % PROGRESS_INTERVAL == 0:
                        print(f"\r  ⏳ {i+1:,} / {count:,} written...", end='', file=sys.stderr)
                f.write(']\n')

            elif args.format == 'csv':
                # Write header from first record
                first = data.user(options if options else None)
                header = ','.join(f'"{k}"' for k in first.keys())
                f.write(header + '\n')
                f.write(_user_to_csv_row(first) + '\n')
                for i in range(1, count):
                    u = data.user(options if options else None)
                    f.write(_user_to_csv_row(u) + '\n')
                    if (i + 1) % PROGRESS_INTERVAL == 0:
                        print(f"\r  ⏳ {i+1:,} / {count:,} written...", end='', file=sys.stderr)

            else:  # json / flat
                f.write('[\n')
                for i in range(count):
                    if args.type == 'companies': u = data.company_gen()
                    elif args.type == 'jobs': u = data.job_gen()
                    elif args.type == 'universities': u = data.university_gen()
                    elif args.type == 'transactions': u = data.transaction_gen()
                    elif args.type == 'medical_records': u = data.medical_record()
                    else: u = data.user(options if options else None)
                    
                    line = json.dumps(u, indent=2 if args.pretty else None)
                    f.write(line + (',' if i < count - 1 else '') + '\n')
                    if (i + 1) % PROGRESS_INTERVAL == 0:
                        print(f"\r  ⏳ {i+1:,} / {count:,} written...", end='', file=sys.stderr)
                f.write(']\n')

        elapsed = round(time.time() - start, 2)
        size_bytes = os.path.getsize(out_path)
        size_label = f"{size_bytes / 1048576:.1f} MB" if size_bytes >= 1048576 else f"{size_bytes / 1024:.1f} KB"
        print('\r', end='', file=sys.stderr)  # clear progress line
        print(
            f"✔ Done! Generated {count:,} records in {elapsed}s → {out_path} ({size_label})",
            file=sys.stderr
        )


def _user_to_csv_row(u):
    """Serialize a single user dict to a CSV row string."""
    import json as _json
    parts = []
    for v in u.values():
        if v is None:
            parts.append('')
        elif isinstance(v, (dict, list)):
            parts.append('"' + _json.dumps(v).replace('"', '""') + '"')
        elif isinstance(v, str):
            parts.append('"' + v.replace('"', '""') + '"')
        else:
            parts.append(str(v))
    return ','.join(parts)


if __name__ == '__main__':
    main()
