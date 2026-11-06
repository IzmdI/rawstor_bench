[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-06 23:04:11

refs/heads/docs-index-diagram

[a969a97](https://github.com/rawstor/librawstor/commit/a969a974c6a92eaa81fcdfc7edcacef1a0134cab)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15514: Fri Nov  6 23:03:32 2026
  read: IOPS=21.1k, BW=82.3MiB/s (86.3MB/s)(824MiB/10001msec)
    slat (nsec): min=641, max=54271, avg=1534.39, stdev=825.72
    clat (usec): min=38, max=2003, avg=92.48, stdev=21.34
     lat (usec): min=40, max=2005, avg=94.01, stdev=21.45
    clat percentiles (usec):
     |  1.00th=[   56],  5.00th=[   67], 10.00th=[   72], 20.00th=[   79],
     | 30.00th=[   83], 40.00th=[   87], 50.00th=[   91], 60.00th=[   95],
     | 70.00th=[   99], 80.00th=[  105], 90.00th=[  115], 95.00th=[  124],
     | 99.00th=[  155], 99.50th=[  169], 99.90th=[  210], 99.95th=[  225],
     | 99.99th=[  619]
   bw (  KiB/s): min=77264, max=91584, per=100.00%, avg=84364.95, stdev=3487.77, samples=20
   iops        : min=19316, max=22896, avg=21091.15, stdev=871.92, samples=20
  lat (usec)   : 50=0.14%, 100=71.57%, 250=28.27%, 500=0.01%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%
  cpu          : usr=26.09%, sys=38.09%, ctx=116195, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=210833,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15518: Fri Nov  6 23:03:32 2026
  write: IOPS=3748, BW=14.6MiB/s (15.4MB/s)(146MiB/10001msec); 0 zone resets
    slat (nsec): min=1212, max=45314, avg=3801.74, stdev=1896.07
    clat (usec): min=300, max=4688, avg=528.25, stdev=161.35
     lat (usec): min=304, max=4691, avg=532.05, stdev=161.25
    clat percentiles (usec):
     |  1.00th=[  347],  5.00th=[  367], 10.00th=[  383], 20.00th=[  408],
     | 30.00th=[  429], 40.00th=[  449], 50.00th=[  474], 60.00th=[  506],
     | 70.00th=[  578], 80.00th=[  668], 90.00th=[  742], 95.00th=[  799],
     | 99.00th=[  955], 99.50th=[ 1090], 99.90th=[ 1696], 99.95th=[ 1893],
     | 99.99th=[ 4359]
   bw (  KiB/s): min=14080, max=15408, per=100.00%, avg=14998.05, stdev=412.54, samples=20
   iops        : min= 3520, max= 3852, avg=3749.45, stdev=103.11, samples=20
  lat (usec)   : 500=58.90%, 750=31.98%, 1000=8.36%
  lat (msec)   : 2=0.71%, 4=0.03%, 10=0.01%
  cpu          : usr=7.61%, sys=10.27%, ctx=32299, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,37487,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=82.3MiB/s (86.3MB/s), 82.3MiB/s-82.3MiB/s (86.3MB/s-86.3MB/s), io=824MiB (864MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=14.6MiB/s (15.4MB/s), 14.6MiB/s-14.6MiB/s (15.4MB/s-15.4MB/s), io=146MiB (154MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=2/91264, sectors=16/2036392, merge=0/143823, ticks=2/11195, in_queue=11198, util=29.88%
```
