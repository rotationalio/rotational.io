---
title: "Data Access Controls for Generative AI"
slug: "data-access-controls-for-generative-ai"
date: "2024-08-26T09:46:34-05:00"
draft: false
image: img/blog/2024-08-26-data-access-controls-for-generative-ai/data-vault.webp
photo_credit: "AI Generated Image from Leonardo.ai"
authors: ['Benjamin Bengfort']
profile: img/team/benjamin-bengfort.png
tags: ['Security', 'AI', 'Data Access']
description: "A proposal for a POSIX-like access control list for vector databases to enable fine-grained data access control for generative AI and machine learning."
---

Anyone who has worked on a POSIX system is used to fine-grained data access rights for files and directories. In a world of generative AI, do we need a new permissions model for files used to train LLMs and serve live inferences?

<!--more-->

## When Access Control Was Easy

File permissions and access controls have long been essential for managing security and data integrity. The POSIX (Portable Operating System Interface) standard, introduced in the early 1980s, provides a straightforward mechanism for defining who can read, write, or execute a file, using a combination of user-based (owner, group, and others) and permission-based (read, write, execute) controls. This model, though simple, has been foundational for managing access in Unix-like systems and remains a cornerstone in many modern operating environments.

As technology has evolved, so too have the demands placed on access control mechanisms. Unlike traditional file systems where access control is relatively straightforward, vector databases used in AI and machine learning environments deal with vast amounts of data vectors that are continuously accessed and modified.

For these new contexts, the traditional POSIX model reveals its limitations. Vector databases often involve intricate data structures that don't map neatly onto the file-centric access control model. Furthermore, the scale and dynamics of modern data use (e.g. training large language models, serving real-time inferences, reconstructing conversation histories, etc.) introduce additional layers of complexity. This complexity necessitates a more granular and flexible approach to access control, one that can handle not only the scale but also the specificity of access requirements.

## POSIX for GenAI: A Proposal

I propose a new permission model for dataset collections and embedded objects that will directly influence model management operations (i.e. MLOps, LLMOps).

This proposal seeks to address these challenges by introducing a POSIX-like access control list tailored for vector databases. Such a system should provide a familiar interface for defining permissions while extending the capabilities to accommodate the unique needs of AI applications.

![Data Access Controls are POSIX-like but adapted for Generative AI](/img/blog/2024-08-26-data-access-controls-for-generative-ai/permissions.webp)

Similar to POSIX file permissions, each model, collection and object will have a user and a group, along with the following permissions flags:

1. **`r`**/**Read**: the entity can retrieve the object for input to a prompt (e.g. for a RAG)
2. **`w`**/**Write**: the entity can write to the given object (e.g. to update a vector)
3. **`t`**/**Train**: the entity can use the object for training a model
4. **`x`**/**Inference**: the object can be output as part of an inference

The two new permissions: _train_ and _inference_ prevent sensitive information from being included in models targeting a specific use case (e.g. as defined by the group permissions) or to prevent data leakage by excluding data from inferencing output.

The rest of this post describes how this permissions model might be implemented and the implications of data access controls on MLOps.

## Machine Learning Operations

The LLM lifecycle, broadly referred to as Machine Learning Operations or MLOps, ensures that models are kept as up-to-date as possible. This process starts with data collection and data set management and ends with a trained model making inferences based on prompts from a user, usually in coordination with retrieval augmented generation (RAG).

There are three basic kinds of artifacts that have to be managed in an MLOps system:

1. _Collections_: a collection of objects identifies a dataset that is used to train a model.
2. _Objects_: a vector embedding of a chunk of data along with a reference to the original.
3. _Models_: an trained instance of a deep neural network that is able to make inferences.

There is a standard relationship between these artifacts: models are trained on collections, collections are made up of references to objects, and models retrieve objects for retrieval augmented generation.

During inferencing there are three additional artifacts that may be managed by an MLOps system and are generally logged for debugging or user experience:

1. _Context_: a series of prompts, system messages, and objects retrieved for RAG.
2. _Prompt_: user input that is used to generate a response from the LLM.
3. _Output_: the output of the LLM including any collected data from a function call.

There is also a standard relationship between these artifacts: contexts are made up of prompts and outputs, prompts and outputs are directly related in a 1:1 fashion, contexts include objects, and models produce the output. Generally speaking, these artifacts are usually stored as a single, structured entity; however for the purpose of data access we've broken them up to describe how permissions might be applied to each.

All artifacts should be versioned and include provenance metadata so that the relationship between artifacts can be audited: both for data quality assurance and for repeatable experimentation. Importantly, the permissions of related objects may change over the course of use by the system, which means without provenance information, data access controls may make it impossible to diagnose what the system did when the artifact was created or modified.

## Data Access Controls

As an MLOps system grows larger, it becomes increasingly important to additionally include data access controls and permissions to ensure that data is used properly and is only made available to the correct users.

A correct implementation of data access controls allows organizations to explore the use of Generative AI on sensitive or proprietary business data without fear of leakage or prompt injection attacks. It may also help to prevent other, as yet unknown, security issues with generative AI, particularly those that may use function calling or are architected as agents that directly influence an organization's operations.

### Ownership and Provenance

Each artifact in an MLOps system should be associated with a user who is the owner (a human operator or system process that created the artifact in the first place) as well as a group -- a collection of users who may have specific kinds of access to the artifact. Permissions are defined for the owner, for the group, and for the system (e.g. everybody that has access to the MLOps system).

For auditing and provenance purposes, every version of the artifact should also be associated with a user (again a human operator or system process) who made the modification that led to the updated version. High security MLOps systems may also include a snapshot of the permissions at the time of the version modification along with the permissions of the associated artifacts.

### Permissions and Inheritance

Permissions are applied at the time of access to an artifact based on the privileges of the logged in user or process. Here are a few examples for an artifact with the below permissions.

```bash
>>> orwtxr--xr---
```

- The owner of the object may read (`r`), write (`w`), train (`t`), and inference (`x`) using the object. That means that they can view the contents of the object (read), update the object and create a new version (write), use the object to train a new model (train), and the object may be used in retrieval augmented generation or as part of the output (execute).
- If the user is in the group that the object belongs to, they may read or inference with the object.
- Anyone else on the system may read the contents of the object but not use it in any other way.

Artifacts generally inherit their permissions from related artifacts. For example, by default an object placed in a collection or a model trained on the collection may have the same permissions as the collection. However this does not have to be true or always remain true. An object's permissions can be changed in a collection, and any future models that are trained on that collection must respect the permissions of that object.

For example, consider a model that is trained on two collections: `emails` and `common`, the user training the model must have the `t` permission on both `emails` and `common` otherwise a permissions error should be raised. Furthermore, the training process must scan all objects in the collections and determine if the user has the `t` permission otherwise the training process must ignore the object in training or abort.

Permissions should also recursively apply to prompts and outputs for downstream training. E.g. a prompt should have an owner and a group and the output of the model should be the disjoint set of the model permissions plus the prompt permissions; following the principle of least privilege, this will ensure that models are not retrained on sensitive data that may have been prompted by a more privileged user.

### Inferencing

The inference permission can be used as a way to prevent sensitive data from leaking out of a model. For example, if an LLM produces an output that has some threshold level of similarity to an object that it doesn't have inference permissions on, the model should either produce different output or quarantine the output. This requires another process to scan the object store for similar objects but most vector databases have indices that make this lookup pretty simple.

Additionally, it is up to the system to determine if the `r` or `x` permission should be applied in retrieval augmented generation. When RAG is used, objects are retrieved from the MLOps system to include as part of the context and to modify the generated output to make it more relevant. If the output is going to directly include the retrieved object, then the `r` permission may be used to determine if the user has access to the object. If the output is going to be generated based on the retrieved object, but not necessarily directly output verbatim or referenced then the `x` permission may be the more relevant permission.

## Why it Matters

Generative AI is [an interface](https://rotational.io/blog/ai-isnt-chatbots-its-an-interface/) that allows us to access the vast amounts of data on the Internet and in our organizations more easily and in a more human fashion. It's becoming increasingly important to ensure high data quality in LLMs so that they don't degrade, hallucinate, or violate our privacy or security expectations.

The evolving landscape of AI and machine learning demands an equally sophisticated approach to data access control. The traditional POSIX model has served us well for decades, but as we push the boundaries of what’s possible, we find ourselves at a crossroads. We need a POSIX-like solution that not only upholds the integrity and security of our data but also embraces the complexities of modern use cases.

This post describes one proposal for such a solution. The approach promises to safeguard data with the precision and flexibility required for the next generation of technological advancements, enabling us to achieve more while mitigating risks, fostering innovation and ensuring that our advances in AI and machine learning are built on a foundation of trust and accountability.