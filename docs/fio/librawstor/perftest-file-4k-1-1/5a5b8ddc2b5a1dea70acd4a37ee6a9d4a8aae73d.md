[&lt; back](..)

# perftest-file-4k-1-1

2026-11-15 12:50:15

refs/heads/add/tls

[5a5b8dd](https://github.com/rawstor/librawstor/commit/5a5b8ddc2b5a1dea70acd4a37ee6a9d4a8aae73d)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16228: Sun Nov 15 12:49:33 2026
  read: IOPS=362k, BW=1416MiB/s (1484MB/s)(13.8GiB/10001msec)
    slat (nsec): min=310, max=37159, avg=342.22, stdev=192.10
    clat (nsec): min=1783, max=60924, avg=2157.36, stdev=511.47
     lat (nsec): min=2114, max=61254, avg=2499.58, stdev=551.71
    clat percentiles (nsec):
     |  1.00th=[ 1880],  5.00th=[ 1976], 10.00th=[ 2008], 20.00th=[ 2064],
     | 30.00th=[ 2064], 40.00th=[ 2096], 50.00th=[ 2128], 60.00th=[ 2128],
     | 70.00th=[ 2160], 80.00th=[ 2192], 90.00th=[ 2256], 95.00th=[ 2384],
     | 99.00th=[ 2832], 99.50th=[ 3408], 99.90th=[11200], 99.95th=[11584],
     | 99.99th=[18048]
   bw (  MiB/s): min= 1399, max= 1422, per=100.00%, avg=1416.47, stdev= 5.61, samples=20
   iops        : min=358202, max=364260, avg=362616.75, stdev=1435.66, samples=20
  lat (usec)   : 2=8.51%, 4=91.18%, 10=0.09%, 20=0.21%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=37.64%, sys=62.35%, ctx=62, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3624369,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=16234: Sun Nov 15 12:49:33 2026
  write: IOPS=2791, BW=10.9MiB/s (11.4MB/s)(109MiB/10001msec); 0 zone resets
    slat (nsec): min=1032, max=26810, avg=2124.06, stdev=893.98
    clat (usec): min=233, max=10634, avg=354.87, stdev=230.75
     lat (usec): min=235, max=10636, avg=356.99, stdev=230.78
    clat percentiles (usec):
     |  1.00th=[  249],  5.00th=[  260], 10.00th=[  269], 20.00th=[  285],
     | 30.00th=[  310], 40.00th=[  322], 50.00th=[  334], 60.00th=[  343],
     | 70.00th=[  359], 80.00th=[  375], 90.00th=[  416], 95.00th=[  474],
     | 99.00th=[  742], 99.50th=[ 1156], 99.90th=[ 3490], 99.95th=[ 4555],
     | 99.99th=[ 8586]
   bw (  KiB/s): min= 9920, max=11992, per=100.00%, avg=11169.50, stdev=533.19, samples=20
   iops        : min= 2480, max= 2998, avg=2792.25, stdev=133.27, samples=20
  lat (usec)   : 250=1.52%, 500=94.43%, 750=3.07%, 1000=0.39%
  lat (msec)   : 2=0.27%, 4=0.26%, 10=0.06%, 20=0.01%
  cpu          : usr=2.15%, sys=2.36%, ctx=27915, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,27913,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1416MiB/s (1484MB/s), 1416MiB/s-1416MiB/s (1484MB/s-1484MB/s), io=13.8GiB (14.8GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=10.9MiB/s (11.4MB/s), 10.9MiB/s-10.9MiB/s (11.4MB/s-11.4MB/s), io=109MiB (114MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=2/71700, sectors=224/2105592, merge=0/108666, ticks=46/12910, in_queue=12957, util=36.59%
```
