[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-15 21:20:08

refs/heads/add/tls

[b0bcf4f](https://github.com/rawstor/librawstor/commit/b0bcf4fdbf7e5a58f3a9d85afb7e5bada8a805b7)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16165: Sun Nov 15 21:19:35 2026
  read: IOPS=47.5k, BW=186MiB/s (195MB/s)(1856MiB/10001msec)
    slat (nsec): min=296, max=24701, avg=447.02, stdev=423.02
    clat (usec): min=10, max=865, avg=20.36, stdev=12.48
     lat (usec): min=10, max=872, avg=20.81, stdev=12.54
    clat percentiles (nsec):
     |  1.00th=[10816],  5.00th=[11072], 10.00th=[11072], 20.00th=[11200],
     | 30.00th=[11328], 40.00th=[11456], 50.00th=[11712], 60.00th=[14656],
     | 70.00th=[34560], 80.00th=[36608], 90.00th=[37632], 95.00th=[40192],
     | 99.00th=[48384], 99.50th=[50944], 99.90th=[57088], 99.95th=[60672],
     | 99.99th=[89600]
   bw (  KiB/s): min=103615, max=289240, per=100.00%, avg=190112.60, stdev=56854.94, samples=20
   iops        : min=25903, max=72310, avg=47528.15, stdev=14213.86, samples=20
  lat (usec)   : 20=67.03%, 50=32.32%, 100=0.64%, 250=0.01%, 500=0.01%
  lat (usec)   : 750=0.01%, 1000=0.01%
  cpu          : usr=12.23%, sys=34.47%, ctx=475053, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=475045,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=16168: Sun Nov 15 21:19:35 2026
  write: IOPS=4445, BW=17.4MiB/s (18.2MB/s)(174MiB/10001msec); 0 zone resets
    slat (nsec): min=611, max=38211, avg=1527.38, stdev=1377.08
    clat (usec): min=117, max=1802, avg=222.89, stdev=41.04
     lat (usec): min=119, max=1804, avg=224.42, stdev=41.10
    clat percentiles (usec):
     |  1.00th=[  167],  5.00th=[  178], 10.00th=[  188], 20.00th=[  196],
     | 30.00th=[  206], 40.00th=[  215], 50.00th=[  221], 60.00th=[  227],
     | 70.00th=[  233], 80.00th=[  241], 90.00th=[  253], 95.00th=[  269],
     | 99.00th=[  412], 99.50th=[  445], 99.90th=[  537], 99.95th=[  627],
     | 99.99th=[  914]
   bw (  KiB/s): min=16944, max=18893, per=100.00%, avg=17791.65, stdev=517.46, samples=20
   iops        : min= 4236, max= 4723, avg=4447.80, stdev=129.38, samples=20
  lat (usec)   : 250=88.56%, 500=11.28%, 750=0.14%, 1000=0.02%
  lat (msec)   : 2=0.01%
  cpu          : usr=2.11%, sys=5.14%, ctx=44459, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,44458,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=186MiB/s (195MB/s), 186MiB/s-186MiB/s (195MB/s-195MB/s), io=1856MiB (1946MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=17.4MiB/s (18.2MB/s), 17.4MiB/s-17.4MiB/s (18.2MB/s-18.2MB/s), io=174MiB (182MB), run=10001-10001msec

Disk stats (read/write):
    dm-0: ios=27/312854, sectors=216/2502832, merge=0/0, ticks=27/57170, in_queue=57197, util=24.32%, aggrios=0/102493, aggsectors=108/1494240, aggrmerge=13/84286, aggrticks=0/3759, aggrin_queue=3759, aggrutil=21.37%
  nvme0n1: ios=1/0, sectors=216/0, merge=26/0, ticks=0/0, in_queue=0, util=0.00%
  nvme1n1: ios=0/204987, sectors=0/2988480, merge=0/168573, ticks=0/7519, in_queue=7519, util=21.37%
```
