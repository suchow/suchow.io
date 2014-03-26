---
layout: post-no-feature
title: "Clockwalk: a stochastic clock"
description:
category: projects
type: Project
tags: [clockwalk, time, stochastic clock]
---

<script type="text/javascript" src="/assets/js/coolclock.js"></script>

<div align="center">
    <canvas id="clockid" class="CoolClock:custom:150:"></canvas>
</div>

{% include separator.html %}

Clocks normally tick once per second, with time moving relentlessly forward at a constant rate. The stochastic clock, in constrast, has ticks that are uniformly distributed from 0&ndash;2 seconds, so that time takes a biased random walk forward. If you're lucky you may grab a few extra seconds. 

What if time really worked this way? Would you be willing to increase the variance of the walk? *How much?*
