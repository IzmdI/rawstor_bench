[&lt; back](..)

# perftest--without-liburing-file-4k-2-1

2026-11-13 10:18:16

refs/heads/add/tenants

[d81fa26](https://github.com/rawstor/librawstor/commit/d81fa26a8eaadcb25b9541e1b6922ae2aafbfe68)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15468: Fri Nov 13 10:17:17 2026
  read: IOPS=509k, BW=1989MiB/s (2086MB/s)(19.4GiB/10001msec)
    slat (nsec): min=204, max=91163, avg=309.74, stdev=199.22
    clat (nsec): min=1808, max=99139, avg=3458.21, stdev=1054.59
     lat (nsec): min=2057, max=99404, avg=3767.95, stdev=1072.51
    clat percentiles (nsec):
     |  1.00th=[ 2128],  5.00th=[ 2288], 10.00th=[ 2416], 20.00th=[ 2768],
     | 30.00th=[ 3024], 40.00th=[ 3248], 50.00th=[ 3344], 60.00th=[ 3472],
     | 70.00th=[ 3568], 80.00th=[ 3888], 90.00th=[ 4384], 95.00th=[ 5408],
     | 99.00th=[ 6112], 99.50th=[ 6432], 99.90th=[13760], 99.95th=[15936],
     | 99.99th=[20096]
   bw (  MiB/s): min= 1956, max= 2034, per=100.00%, avg=1990.40, stdev=17.94, samples=20
   iops        : min=500972, max=520749, avg=509542.35, stdev=4591.83, samples=20
  lat (usec)   : 2=0.09%, 4=82.14%, 10=17.39%, 20=0.37%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=56.09%, sys=43.90%, ctx=74, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=5093170,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15474: Fri Nov 13 10:17:17 2026
  write: IOPS=2533, BW=9.90MiB/s (10.4MB/s)(99.0MiB/10001msec); 0 zone resets
    slat (nsec): min=442, max=33426, avg=1380.50, stdev=1938.65
    clat (usec): min=268, max=120336, avg=786.81, stdev=1448.26
     lat (usec): min=270, max=120337, avg=788.19, stdev=1448.29
    clat percentiles (usec):
     |  1.00th=[  314],  5.00th=[  367], 10.00th=[  449], 20.00th=[  668],
     | 30.00th=[  693], 40.00th=[  717], 50.00th=[  742], 60.00th=[  766],
     | 70.00th=[  791], 80.00th=[  832], 90.00th=[ 1029], 95.00th=[ 1139],
     | 99.00th=[ 1287], 99.50th=[ 1385], 99.90th=[ 4178], 99.95th=[30016],
     | 99.99th=[81265]
   bw (  KiB/s): min= 3400, max=11006, per=100.00%, avg=10140.55, stdev=1649.67, samples=20
   iops        : min=  850, max= 2751, avg=2535.10, stdev=412.40, samples=20
  lat (usec)   : 500=10.46%, 750=43.66%, 1000=34.96%
  lat (msec)   : 2=10.73%, 4=0.08%, 10=0.03%, 20=0.01%, 50=0.04%
  lat (msec)   : 100=0.02%, 250=0.01%
  cpu          : usr=1.48%, sys=5.10%, ctx=50915, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,25342,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1989MiB/s (2086MB/s), 1989MiB/s-1989MiB/s (2086MB/s-2086MB/s), io=19.4GiB (20.9GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=9.90MiB/s (10.4MB/s), 9.90MiB/s-9.90MiB/s (10.4MB/s-10.4MB/s), io=99.0MiB (104MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=7/66956, sectors=312/2001136, merge=0/99996, ticks=21/73964, in_queue=73986, util=45.45%
```
