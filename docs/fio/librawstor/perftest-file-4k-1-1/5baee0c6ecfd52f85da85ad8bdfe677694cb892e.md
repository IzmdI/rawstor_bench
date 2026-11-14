[&lt; back](..)

# perftest-file-4k-1-1

2026-11-14 09:16:20

refs/heads/add/tls

[5baee0c](https://github.com/rawstor/librawstor/commit/5baee0c6ecfd52f85da85ad8bdfe677694cb892e)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16232: Sat Nov 14 09:16:02 2026
  read: IOPS=376k, BW=1469MiB/s (1540MB/s)(14.3GiB/10001msec)
    slat (nsec): min=281, max=59823, avg=319.14, stdev=181.16
    clat (nsec): min=1783, max=57087, avg=2098.91, stdev=469.26
     lat (nsec): min=2094, max=66095, avg=2418.05, stdev=508.50
    clat percentiles (nsec):
     |  1.00th=[ 1880],  5.00th=[ 1960], 10.00th=[ 1976], 20.00th=[ 2008],
     | 30.00th=[ 2024], 40.00th=[ 2040], 50.00th=[ 2064], 60.00th=[ 2096],
     | 70.00th=[ 2096], 80.00th=[ 2128], 90.00th=[ 2160], 95.00th=[ 2256],
     | 99.00th=[ 2608], 99.50th=[ 3248], 99.90th=[10816], 99.95th=[11072],
     | 99.99th=[16512]
   bw (  MiB/s): min= 1433, max= 1478, per=100.00%, avg=1469.96, stdev= 9.12, samples=20
   iops        : min=366934, max=378576, avg=376310.90, stdev=2335.72, samples=20
  lat (usec)   : 2=19.11%, 4=80.62%, 10=0.06%, 20=0.21%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=37.35%, sys=62.63%, ctx=61, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3761250,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=16237: Sat Nov 14 09:16:02 2026
  write: IOPS=3200, BW=12.5MiB/s (13.1MB/s)(125MiB/10001msec); 0 zone resets
    slat (nsec): min=1162, max=28022, avg=2090.45, stdev=850.27
    clat (usec): min=200, max=18688, avg=309.11, stdev=166.34
     lat (usec): min=201, max=18691, avg=311.20, stdev=166.36
    clat percentiles (usec):
     |  1.00th=[  217],  5.00th=[  241], 10.00th=[  251], 20.00th=[  265],
     | 30.00th=[  273], 40.00th=[  289], 50.00th=[  297], 60.00th=[  306],
     | 70.00th=[  318], 80.00th=[  330], 90.00th=[  355], 95.00th=[  392],
     | 99.00th=[  545], 99.50th=[  685], 99.90th=[ 2089], 99.95th=[ 2671],
     | 99.99th=[ 5538]
   bw (  KiB/s): min=12152, max=13448, per=100.00%, avg=12804.90, stdev=367.54, samples=20
   iops        : min= 3038, max= 3362, avg=3201.20, stdev=91.87, samples=20
  lat (usec)   : 250=8.97%, 500=89.46%, 750=1.17%, 1000=0.09%
  lat (msec)   : 2=0.20%, 4=0.08%, 10=0.03%, 20=0.01%
  cpu          : usr=2.34%, sys=2.77%, ctx=32007, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,32005,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1469MiB/s (1540MB/s), 1469MiB/s-1469MiB/s (1540MB/s-1540MB/s), io=14.3GiB (15.4GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=12.5MiB/s (13.1MB/s), 12.5MiB/s-12.5MiB/s (13.1MB/s-13.1MB/s), io=125MiB (131MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=1/82092, sectors=216/2329208, merge=0/124092, ticks=1/17049, in_queue=17050, util=35.30%
```
