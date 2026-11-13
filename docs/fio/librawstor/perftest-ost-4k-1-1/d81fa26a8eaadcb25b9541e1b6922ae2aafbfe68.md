[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-13 10:18:16

refs/heads/add/tenants

[d81fa26](https://github.com/rawstor/librawstor/commit/d81fa26a8eaadcb25b9541e1b6922ae2aafbfe68)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16215: Fri Nov 13 10:17:54 2026
  read: IOPS=16.9k, BW=66.1MiB/s (69.3MB/s)(661MiB/10001msec)
    slat (nsec): min=731, max=37671, avg=1165.76, stdev=636.78
    clat (usec): min=34, max=2064, avg=57.06, stdev=10.87
     lat (usec): min=36, max=2065, avg=58.23, stdev=11.09
    clat percentiles (usec):
     |  1.00th=[   47],  5.00th=[   47], 10.00th=[   48], 20.00th=[   49],
     | 30.00th=[   50], 40.00th=[   51], 50.00th=[   54], 60.00th=[   60],
     | 70.00th=[   62], 80.00th=[   65], 90.00th=[   69], 95.00th=[   75],
     | 99.00th=[   89], 99.50th=[   93], 99.90th=[  101], 99.95th=[  106],
     | 99.99th=[  125]
   bw (  KiB/s): min=59783, max=77096, per=100.00%, avg=67669.25, stdev=4282.37, samples=20
   iops        : min=14945, max=19274, avg=16917.20, stdev=1070.63, samples=20
  lat (usec)   : 50=29.08%, 100=70.81%, 250=0.11%, 500=0.01%, 750=0.01%
  lat (msec)   : 4=0.01%
  cpu          : usr=10.52%, sys=36.65%, ctx=169120, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=169111,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=16218: Fri Nov 13 10:17:54 2026
  write: IOPS=2291, BW=9165KiB/s (9385kB/s)(89.5MiB/10001msec); 0 zone resets
    slat (nsec): min=2094, max=97643, avg=3287.97, stdev=1498.55
    clat (usec): min=305, max=10225, avg=431.55, stdev=175.98
     lat (usec): min=308, max=10228, avg=434.84, stdev=176.03
    clat percentiles (usec):
     |  1.00th=[  322],  5.00th=[  334], 10.00th=[  343], 20.00th=[  367],
     | 30.00th=[  392], 40.00th=[  404], 50.00th=[  412], 60.00th=[  424],
     | 70.00th=[  437], 80.00th=[  453], 90.00th=[  486], 95.00th=[  545],
     | 99.00th=[ 1074], 99.50th=[ 1680], 99.90th=[ 2376], 99.95th=[ 2573],
     | 99.99th=[ 5014]
   bw (  KiB/s): min= 8440, max= 9696, per=100.00%, avg=9167.95, stdev=346.98, samples=20
   iops        : min= 2110, max= 2424, avg=2291.90, stdev=86.72, samples=20
  lat (usec)   : 500=91.94%, 750=6.45%, 1000=0.51%
  lat (msec)   : 2=0.82%, 4=0.24%, 10=0.02%, 20=0.01%
  cpu          : usr=2.66%, sys=6.07%, ctx=22921, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,22914,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=66.1MiB/s (69.3MB/s), 66.1MiB/s-66.1MiB/s (69.3MB/s-69.3MB/s), io=661MiB (693MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=9165KiB/s (9385kB/s), 9165KiB/s-9165KiB/s (9385kB/s-9385kB/s), io=89.5MiB (93.9MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=14/58845, sectors=320/1353232, merge=0/89006, ticks=10/8111, in_queue=8122, util=29.68%
```
