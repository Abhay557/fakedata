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
        # Remove None values so defaults are used inside the engine
        options = {k: v for k, v in options.items() if v is not None and v != 0.0}

        start = time.time()

        if args.timeseries:
            results = [
                data.user_time_series({**options, 'days': args.days, 'events_per_day': args.events_per_day})
                for _ in range(args.count)
            ]
            output = json.dumps(results, indent=2 if args.pretty else None)

        elif args.format == 'csv':
            output = data.users_to_csv(args.count, options if options else None)

        elif args.format == 'flat':
            rows = data.users_flat(args.count, options if options else None)
            output = json.dumps(rows, indent=2 if args.pretty else None)

        else:  # json
            if args.pretty:
                output = data.users_to_json(args.count, options if options else None)
            else:
                output = json.dumps(data.users(args.count, options if options else None))

        elapsed = round(time.time() - start, 2)

        if args.output:
            out_path = os.path.abspath(args.output)
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(output)
            size_kb = round(len(output.encode('utf-8')) / 1024, 1)
            print(
                f"✔ Done! Generated {args.count:,} users in {elapsed}s → {out_path} ({size_kb} KB)",
                file=sys.stderr
            )
        else:
            print(output)


if __name__ == '__main__':
    main()
