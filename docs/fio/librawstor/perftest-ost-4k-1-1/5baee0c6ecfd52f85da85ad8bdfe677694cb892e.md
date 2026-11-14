[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-14 09:16:20

refs/heads/add/tls

[5baee0c](https://github.com/rawstor/librawstor/commit/5baee0c6ecfd52f85da85ad8bdfe677694cb892e)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16060: Sat Nov 14 09:15:36 2026
  read: IOPS=29.8k, BW=116MiB/s (122MB/s)(1164MiB/10001msec)
    slat (nsec): min=310, max=17506, avg=486.92, stdev=300.95
    clat (usec): min=26, max=429, avg=32.72, stdev= 4.76
     lat (usec): min=26, max=430, avg=33.21, stdev= 4.84
    clat percentiles (usec):
     |  1.00th=[   29],  5.00th=[   30], 10.00th=[   30], 20.00th=[   30],
     | 30.00th=[   30], 40.00th=[   31], 50.00th=[   31], 60.00th=[   33],
     | 70.00th=[   35], 80.00th=[   36], 90.00th=[   38], 95.00th=[   41],
     | 99.00th=[   51], 99.50th=[   55], 99.90th=[   63], 99.95th=[   70],
     | 99.99th=[  104]
   bw (  KiB/s): min=106800, max=129056, per=100.00%, avg=119290.95, stdev=6525.74, samples=20
   iops        : min=26700, max=32264, avg=29822.65, stdev=1631.39, samples=20
  lat (usec)   : 50=98.93%, 100=1.06%, 250=0.01%, 500=0.01%
  cpu          : usr=7.61%, sys=39.21%, ctx=298082, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=298079,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=16063: Sat Nov 14 09:15:36 2026
  write: IOPS=1762, BW=7048KiB/s (7217kB/s)(68.8MiB/10001msec); 0 zone resets
    slat (nsec): min=771, max=17686, avg=1954.01, stdev=908.32
    clat (usec): min=234, max=307753, avg=564.49, stdev=4382.38
     lat (usec): min=236, max=307755, avg=566.45, stdev=4382.40
    clat percentiles (usec):
     |  1.00th=[   249],  5.00th=[   260], 10.00th=[   269], 20.00th=[   289],
     | 30.00th=[   306], 40.00th=[   318], 50.00th=[   326], 60.00th=[   334],
     | 70.00th=[   347], 80.00th=[   359], 90.00th=[   383], 95.00th=[   437],
     | 99.00th=[  2245], 99.50th=[  9634], 99.90th=[ 52167], 99.95th=[108528],
     | 99.99th=[170918]
   bw (  KiB/s): min=  952, max=10376, per=100.00%, avg=7051.80, stdev=2877.72, samples=20
   iops        : min=  238, max= 2594, avg=1762.90, stdev=719.43, samples=20
  lat (usec)   : 250=1.38%, 500=95.10%, 750=1.34%, 1000=0.52%
  lat (msec)   : 2=0.60%, 4=0.30%, 10=0.27%, 20=0.22%, 50=0.17%
  lat (msec)   : 100=0.06%, 250=0.05%, 500=0.01%
  cpu          : usr=1.00%, sys=3.23%, ctx=17622, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,17622,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=116MiB/s (122MB/s), 116MiB/s-116MiB/s (122MB/s-122MB/s), io=1164MiB (1221MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=7048KiB/s (7217kB/s), 7048KiB/s-7048KiB/s (7217kB/s-7217kB/s), io=68.8MiB (72.2MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=1/44936, sectors=216/1069024, merge=0/67710, ticks=0/34463, in_queue=34464, util=39.87%
```
