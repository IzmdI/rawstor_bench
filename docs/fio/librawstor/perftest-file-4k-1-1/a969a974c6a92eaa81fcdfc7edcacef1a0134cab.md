[&lt; back](..)

# perftest-file-4k-1-1

2026-11-06 23:04:11

refs/heads/docs-index-diagram

[a969a97](https://github.com/rawstor/librawstor/commit/a969a974c6a92eaa81fcdfc7edcacef1a0134cab)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15520: Fri Nov  6 23:03:14 2026
  read: IOPS=314k, BW=1228MiB/s (1288MB/s)(12.0GiB/10001msec)
    slat (nsec): min=541, max=40425, avg=647.34, stdev=264.34
    clat (nsec): min=1984, max=54552, avg=2281.83, stdev=506.03
     lat (nsec): min=2594, max=55183, avg=2929.17, stdev=580.12
    clat percentiles (nsec):
     |  1.00th=[ 2128],  5.00th=[ 2160], 10.00th=[ 2160], 20.00th=[ 2192],
     | 30.00th=[ 2224], 40.00th=[ 2224], 50.00th=[ 2224], 60.00th=[ 2256],
     | 70.00th=[ 2288], 80.00th=[ 2288], 90.00th=[ 2352], 95.00th=[ 2416],
     | 99.00th=[ 2640], 99.50th=[ 3408], 99.90th=[11200], 99.95th=[11584],
     | 99.99th=[18048]
   bw (  MiB/s): min= 1217, max= 1237, per=100.00%, avg=1228.75, stdev= 5.23, samples=20
   iops        : min=311613, max=316926, avg=314558.95, stdev=1338.74, samples=20
  lat (usec)   : 2=0.01%, 4=99.70%, 10=0.07%, 20=0.22%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=48.92%, sys=51.06%, ctx=60, majf=0, minf=37
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3144374,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15522: Fri Nov  6 23:03:14 2026
  write: IOPS=2994, BW=11.7MiB/s (12.3MB/s)(117MiB/10001msec); 0 zone resets
    slat (nsec): min=1383, max=22772, avg=2699.82, stdev=977.77
    clat (usec): min=206, max=11718, avg=329.94, stdev=188.96
     lat (usec): min=208, max=11720, avg=332.64, stdev=188.98
    clat percentiles (usec):
     |  1.00th=[  235],  5.00th=[  251], 10.00th=[  258], 20.00th=[  273],
     | 30.00th=[  289], 40.00th=[  306], 50.00th=[  318], 60.00th=[  326],
     | 70.00th=[  343], 80.00th=[  359], 90.00th=[  388], 95.00th=[  424],
     | 99.00th=[  594], 99.50th=[  750], 99.90th=[ 1876], 99.95th=[ 2737],
     | 99.99th=[11469]
   bw (  KiB/s): min=11080, max=12776, per=100.00%, avg=11982.70, stdev=478.48, samples=20
   iops        : min= 2770, max= 3194, avg=2995.60, stdev=119.64, samples=20
  lat (usec)   : 250=4.85%, 500=92.94%, 750=1.71%, 1000=0.13%
  lat (msec)   : 2=0.29%, 4=0.04%, 10=0.03%, 20=0.01%
  cpu          : usr=2.58%, sys=2.53%, ctx=29955, majf=0, minf=37
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,29952,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1228MiB/s (1288MB/s), 1228MiB/s-1228MiB/s (1288MB/s-1288MB/s), io=12.0GiB (12.9GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.7MiB/s (12.3MB/s), 11.7MiB/s-11.7MiB/s (12.3MB/s-12.3MB/s), io=117MiB (123MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=3/76412, sectors=24/2137632, merge=0/115863, ticks=9/12325, in_queue=12334, util=35.85%
```
