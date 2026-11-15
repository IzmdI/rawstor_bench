[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15499: Sun Nov 15 12:03:33 2026
  read: IOPS=89.7k, BW=350MiB/s (367MB/s)(3505MiB/10001msec)
    slat (nsec): min=210, max=94212, avg=264.14, stdev=187.77
    clat (usec): min=13, max=1040, avg=21.87, stdev= 8.03
     lat (usec): min=13, max=1040, avg=22.13, stdev= 8.05
    clat percentiles (usec):
     |  1.00th=[   14],  5.00th=[   15], 10.00th=[   15], 20.00th=[   18],
     | 30.00th=[   20], 40.00th=[   21], 50.00th=[   22], 60.00th=[   23],
     | 70.00th=[   24], 80.00th=[   26], 90.00th=[   28], 95.00th=[   30],
     | 99.00th=[   36], 99.50th=[   39], 99.90th=[   59], 99.95th=[  186],
     | 99.99th=[  322]
   bw (  KiB/s): min=306328, max=375696, per=100.00%, avg=359022.85, stdev=16559.54, samples=20
   iops        : min=76582, max=93924, avg=89755.80, stdev=4139.92, samples=20
  lat (usec)   : 20=34.24%, 50=65.64%, 100=0.05%, 250=0.06%, 500=0.01%
  lat (usec)   : 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=11.77%, sys=69.02%, ctx=366874, majf=0, minf=1371
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=897180,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15504: Sun Nov 15 12:03:33 2026
  write: IOPS=5144, BW=20.1MiB/s (21.1MB/s)(201MiB/10001msec); 0 zone resets
    slat (nsec): min=390, max=98028, avg=717.78, stdev=676.51
    clat (usec): min=237, max=4187, avg=387.65, stdev=122.62
     lat (usec): min=238, max=4188, avg=388.37, stdev=122.66
    clat percentiles (usec):
     |  1.00th=[  262],  5.00th=[  277], 10.00th=[  293], 20.00th=[  314],
     | 30.00th=[  330], 40.00th=[  347], 50.00th=[  363], 60.00th=[  383],
     | 70.00th=[  404], 80.00th=[  433], 90.00th=[  523], 95.00th=[  578],
     | 99.00th=[  693], 99.50th=[  783], 99.90th=[ 1860], 99.95th=[ 2212],
     | 99.99th=[ 3228]
   bw (  KiB/s): min=17440, max=21416, per=100.00%, avg=20588.95, stdev=844.02, samples=20
   iops        : min= 4360, max= 5354, avg=5147.15, stdev=211.03, samples=20
  lat (usec)   : 250=0.14%, 500=87.42%, 750=11.86%, 1000=0.24%
  lat (msec)   : 2=0.27%, 4=0.07%, 10=0.01%
  cpu          : usr=1.26%, sys=6.69%, ctx=46945, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,51455,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=350MiB/s (367MB/s), 350MiB/s-350MiB/s (367MB/s-367MB/s), io=3505MiB (3675MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=20.1MiB/s (21.1MB/s), 20.1MiB/s-20.1MiB/s (21.1MB/s-21.1MB/s), io=201MiB (211MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=2/120047, sectors=224/2538152, merge=0/177728, ticks=10/19806, in_queue=19818, util=37.92%
```
