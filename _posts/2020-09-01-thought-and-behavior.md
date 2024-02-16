---
layout: course
title: "Computational Models of Thought and Behavior"
description:
category: hidden
type: course
tags: [mgt451a]
semester: Fall 2020
college: Stevens Institute of Technology
permalink: /thought-and-behavior/
---

<img style="border: 1px solid #ccdddd" src="{{site.baseurl}}/images/head2.png" />

Course site for MGT 451A, with a list of [class meetings](#class-meetings) and [assignments](#assignments).

{% include separator.html %}

In this course, we review computational models of thought and behavior from across the behavioral and social sciences, including economics, psychology, evolutionary biology, network science, information systems, and sociology. The course begins by studying individual thought and behavior, from predicting the future to taking risks. The course proceeds to study group thought and behavior, from social influence to the design of voting mechanisms. Each class covers a new topic in the study of thought and behavior and introduces the range of empirical and theoretical computational approaches to studying that topic.

{% include separator.html %}

### Class meetings

#### A whirlwind tour of thought and behavior, together and apart.

Monday, 8/26

Topics:
- Overview of class
- Small-group discussion to spark interest
- Review this syllabus

Readings:
- This syllabus
- “The Standard Equipment” by Steve Pinker
- NCM Chapter 1


### Part I: Computational models of individual thought and behavior.


#### On predicting the future.

Day, Date

Topics:
- The Anthropic Principle, in
- Basics of Bayesian inference
- “Optimal predictions in everyday life” by Griffiths & Tenenbaum.
- The end-of-history illusion
- The recency illusion
- Retrofuturism

Readings:
- The Anthropic Principle by J. Richad Gott
- Retrofuturism subreddit (https://www.reddit.com/r/RetroFuturism/top/?t=all)

Assignment #1: In this assignment, you will replicate the experiment detailed in the  “Optimal predictions…” reading.

#### On reasoning about what might have been.

Day, Date

Topics:
- Causal graphical models
- Measures of simplicity in causal explanation
- The survivorship bias

#### On seeking and avoiding risk.

Day, Date

Topics:
- Kahneman and Tversky and the history of behavioral economics
- Risk aversion
- The certainty effect
- Expected Value Theory
- Expected Utility Theory

Assignment #2: In this assignment, you will implementing Expected Value Theory and Expected Utility Theory using the Python language and demonstrate a choice anomaly.

#### On gaining and losing.

Day, Date

Topics:
- Prospect theory
- “When less is more” and counterfactual reasoning
- Anchoring and adjustment

#### On choosing between now and later.

Day, Date

Topics:
- Intertemporal choice
- Hyperbolic vs. exponential discounting
- Cooperating with the future

Assignment #3: In this assignment, you will measuring your own temporal discounting function and determine whether it is better described as a hyperbolic or exponential function.

#### On being rational.

Day, Date

Topics:
- Marr’s three levels and definitions of rationality
- The Allais paradox
- Ellsberg paradox
- The Law of Small Numbers
- Gambler’s Fallacy

#### On exploring and exploiting.

Day, Date

Topics:
- Multiarmed bandit problems
- The Gittins index
- The Upper Confidence Bound algorithm
- Epsilon-greedy strategies for solving multiarmed bandit problems
- Thompson sampling
- From multiarmed bandits to contextual bandits

#### On deciding under incomplete information.

Day, Date

Topics:
- Markov Processes
- Markov Decision Processes
- Partially Observable Markov Decision Processes

Assignment #4: In this assignment, you will implement a Partially Observable Markov Decision process using the Python programming language.

#### On thinking, fast and slow.

Day, Date

Topics:
- Drift diffusion models of choice
- System I and System II thinking
- The idea of time as a resource

#### On summarizing one’s experience.

Day, Date

Topics:
- Peak-end rule
- Extension neglect
- Duration neglect
- Representativeness heuristic

#### On having limits.

Day, Date

Topics:
- Bounded rationality
- The concept of attentional limits
- Availability heuristics
- Base-rate neglect
- Conjunction fallacy
- Resource rationality

Assignment #5: In this assignment, you will test some of your own perceptual and attentional limits and consider various ways to quantify them.

#### On knowing thyself.

Day, Date

Topics:
- Metacognition
- Dunning-Kruger effect
- Curse of knowledge

#### On having preferences.

Day, Date

Topics:
- Preferences
- Implicit Associations
- Multi-objective scalarization
- Multi-objective optimization

Assignment #6: In this assignment, you will take an online version of the Implicit Association Test.

#### On wishing it were so.

Day, Date

Topics:
- Motivated reasoning
- Survivorship bias
- Selection biases

#### “But I like it / Because it is bitter / And because it is my heart.”

Day, Date

Topics:
- The Endowment Effect
- The Ikea Effect
- Not Invented Here disorder
- The Illusion of Control

#### On the troubled history of intelligence.

Day, Date

Topics:
- What is intelligence?
- The troubled history of studying intelligence
- The foundations of eugenics
- Measuring and modeling “general” intelligence (G)
- The concept of multiple intelligences
- The Intelligence Quotient (IQ)

#### Midterm exam.

### Part II: Computational models of collective thought and behavior.

#### On evolving over time.

Day, Date

Topics:
- Is evolution actually survival of the fittest?
- The Iterated Prisoner’s Dilemma (IPD)
- IPD on structured networks

Readings:
- NCM Chapter 6

Assignment #7: In this assignment, you will write an evolutionary IPD tournament in Python.

#### On the wisdom of the crowd.

Day, Date

Topics:
- Francis Galton and the voice of the people
- The Delphi Method
- The Bayesian Truth Serum

Readings:
- Vox Populi
- Bayesian Truth Serum paper

Assignment #8: In this assignment, you will replicating the wisdom of the crowds effect from the Galton reading.

#### On designing good mechanisms.

Day, Date

Topics:
- Algorithmic Game Theory
- Game theory vs. mechanism design
- Algorithmic mechanism design
- The Price of Anarchy
- Mechanisms for Voting
- Mechanisms for Auctions

#### On collective intelligence.

Day, Date

Topics:
- Schooling in fish
- Social learning
- Collective intelligence
- Crowdsourced markets

#### On recursive social reasoning.

Day, Date

Topics:
- Theory of mind
- Schelling coordination games
- Keynesian beauty contests
- El Farol Bar Problem
- The minority game
- Limits to recursive reasoning

#### On social influence.

Day, Date

Topics:
- Conformity bias
- Prestige bias
- Herding in crowds
- Information cascades
- Ingroup bias
- Fundamental attribution error

#### On being fair.

Day, Date

Topics:
- Algorithmic fairness
- Cake cutting
- Fair division

Assignment #9: In this assignment, you will studying the fairness of an AI system.

#### On being altruistic.

Day, Date

Topics:
- The Dictator Game
- The Ultimatum Game

#### On remembering together.

Day, Date

Topics:
- Collective memory
- Transactive memory
- Interactive cueing
- Forgetting on networks

Assignment #10: In this assignment, you will replicate the effect of interactive cueing with a friend.

#### Final exam.


{% include separator.html %}

### Assignments

<!-- #### 1 --- You and your learning.
`2018-09-07`

_Instructions_: Complete the introductory survey sent to you by email and submit it in the body of a reply (only) to me.

#### 2 --- Getting curious about cognition.
`2018-09-14`

_Instructions_: As part of this course, you will write a final paper that uses existing research on human cognition to answer a question that you've posed. The first step is to think of some good questions. What drew you to the study of the mind? What have you experienced or noticed about yourself or others that seems interesting, strange, wonderful, or hard to explain? What are you curious about? In this assignment, you will generate a list of 10 questions about cognition. For example, some questions I've had recently are "What's going on when I struggle to recall something, and then it pops into my mind 10 minutes later?"; "Does everyone in the world have a doppelgänger?"; and "How well could I learn Japanese if I spent the next 40 years studying it for a few hours a week?". Compile your questions in a Word file and [submit it here](https://www.dropbox.com/request/uY7DYRP7ZOrdhz9uevrE).

#### 3 --- Intuitive cartography of mental maps.
`2018-09-21`

_Instructions_: On a large sheet of paper (at least 8.5 &times; 11 inches), draw a map of a place that you know well (e.g., a room, building, neighborhood, or city). Your map can be as detailed or abstract as you see fit, but you should spend a significant amount of time crafting it, at least an hour. (If your map is simple and abstract, consider working through a few drafts.) Critically, you should not use any external resource like Google Maps or a building floor plan to help you out. The goal is to confront the ways in which your mental representation of the place differs from the kind of map that a cartographer might draw.

On the back, write a few sentences pointing out what properties of the world your map brings to the fore and what properties it does not.

Take a photo of your map, or scan it, and [submit it as a JPG or PDF here](https://www.dropbox.com/request/c57aoUeF7Bp8UguXlshA).

#### 4 --- Playing _rock paper scissors_.
`2018-09-28`

_Instructions_: Define an AI that plays rock–paper–scissors in a human-like way. First define how the player will represent the game (its mental representation); then define its strategy (a process over that mental representation). Find a friend to play a few rounds against the player you have defined. Write 500–1000 words defining the representation and process you chose. What aspects of human behavior does your model capture? What aspects of human behavior does your model fail to capture? Write up your assignment in a Word file and [submit it here](https://www.dropbox.com/request/5TdCK2cnzFTjTWGFoBYz).

#### 5 --- Narrowing your focus.
`2018-10-12`

_Instructions_: Use the 10 questions you asked in Assignment #2, any feedback you got, and anything you've learned or thought about in the course so far to craft 3 questions about cognition that may serve as a topic for your final paper. Rate each question in terms of how excited you would be to write your paper on that topic, on a scale of 1 (aka, "please don't make me write about this") to 10 (aka, "I'd hate to write about anything else"). [Submit it here](https://www.dropbox.com/request/3ZkKEl9Vz0eqA6z7dSVJ).

#### 6 --- A problem set on causality.
`2018-10-19`

_Instructions_: Read [pages 510--522 of Artificial Intelligence: a Modern Approach (AIMA)]({{site.url}}/assets/cognition/causality.pdf). Complete exercises 14.1, 14.4, and 14.11. Finally, think of an everyday scenario where a person has an incorrect causal model of something. Describe the scenario and misconception, and then draw two Bayes nets, one representing the truth, the other representing the misconception. [Submit your problem set here](https://www.dropbox.com/request/30WxfOysbnfUmx4vpMmc).

#### 7 --- Selecting a final-paper topic.
`2018-10-26`

_Instructions_: Select a topic for your final paper, then write a tentative outline of the paper. [Submit it here](https://www.dropbox.com/request/3xGtUTqLv1UxSljyGqao).

#### 8 --- Replicating false memories in the DRM paradigm.
`2018-11-09`

_Instructions_: The Deese-Roediger-McDermott paradigm is a classic method for studying false memories in the lab. [Here](https://psychology.hanover.edu/classes/Cognition/Papers/RoedigerMcDermott%201996%20DRM%20False.pdf) is the original paper describing the paradigm. Replicate either the serial-position effect (Figure 1) or the rate of intrusions by running the experiment on some friends. The original word lists can be found on the last page of the paper. Submit a [plot of the results here](https://www.dropbox.com/request/RDtX6TnIYut68A35IHNW).

#### 9 --- A checkpoint.
`2018-12-07`

_Instructions_: By now, you should have made significant progress on your paper. Upload a draft with at least 1/3 the final word count as a checkpoint. Submit your draft [here](https://www.dropbox.com/request/yNTkILF4FbHRH13P52Za).

#### 10 --- Replicating the wisdom of the crowd.
`2018-12-07`

_Instructions_: In the *wisdom of the crowds* effect, which you can read about in Galton's *Vox Populi* (one of the readings from the class on collective intelligence), the median estimate of a group of non-experts is found to be surprisingly accurate. Here, you'll replicate that effect. First, think of a quantity that your peers are unlikely to know, but wouldn't necessarily be surprised to learn. Next, ask at least 20 people to estimate the quantity. Make sure each person earnestly tries their best to get it right. (If you'd like to participate in the class pool, submitting your own example and providing responses to everyone else's in the pool, email your example to `jsuchow@wellesley.edu`.)

Once you've collected the data, create a document with (a) the question you asked participants, (b) the correct answer, (c) a histogram of participants' responses, (d) the mean response, and (e) the median response. Finally, write a sentence or two about whether your data replicated the effect.

Submit your writeup [here](https://www.dropbox.com/request/tbrHgOfXmu5Cxa5onOVq). -->

{% include separator.html %}
