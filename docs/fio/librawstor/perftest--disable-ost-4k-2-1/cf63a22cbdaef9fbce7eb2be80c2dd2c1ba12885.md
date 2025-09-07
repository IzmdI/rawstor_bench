[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-09-06 21:10:49 UTC

refs/heads/feat/protocol

[cf63a22](https://github.com/rawstor/librawstor/commit/cf63a22cbdaef9fbce7eb2be80c2dd2c1ba12885)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9836: Sat Sep  6 21:10:47 2025
  read: IOPS=69.5k, BW=271MiB/s (285MB/s)(2714MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5382.26, stdev=2826.89
     lat (nsec): min=1242, max=172832, avg=4982.72, stdev=4032.54
    clat percentiles (msec):
     |  1.00th=[  239],  5.00th=[  743], 10.00th=[ 1368], 20.00th=[ 2567],
     | 30.00th=[ 3574], 40.00th=[ 4530], 50.00th=[ 5403], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=222488, max=329752, per=99.46%, avg=276393.68, stdev=33775.98, samples=19
   iops        : min=55622, max=82438, avg=69098.42, stdev=8444.08, samples=19
  write: IOPS=69.4k, BW=271MiB/s (284MB/s)(2710MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5380.50, stdev=2826.19
     lat (usec): min=3, max=1137, avg=22.89, stdev= 8.34
    clat percentiles (msec):
     |  1.00th=[  236],  5.00th=[  743], 10.00th=[ 1368], 20.00th=[ 2567],
     | 30.00th=[ 3574], 40.00th=[ 4530], 50.00th=[ 5403], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=222008, max=329584, per=99.51%, avg=276125.89, stdev=33289.96, samples=19
   iops        : min=55502, max=82396, avg=69031.47, stdev=8322.54, samples=19
  lat (msec)   : 250=1.12%, 500=1.99%, 750=1.94%, 1000=2.06%, 2000=8.13%
  lat (msec)   : >=2000=84.75%
  cpu          : usr=15.81%, sys=50.21%, ctx=293974, majf=0, minf=15
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=694808,693815,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=271MiB/s (285MB/s), 271MiB/s-271MiB/s (285MB/s-285MB/s), io=2714MiB (2846MB), run=10001-10001msec
  WRITE: bw=271MiB/s (284MB/s), 271MiB/s-271MiB/s (284MB/s-284MB/s), io=2710MiB (2842MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/121, sectors=0/28368, merge=0/679, ticks=0/167, in_queue=167, util=0.09%
```
