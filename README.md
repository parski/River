![](river.png)  

> And out again I curve and flow  
> To join the brimming river,  
> For men may come and men may go,  
> But I go on for ever.  

# River Protocol Specification

Version 1.0  
Author: Pär Strindevall

## Abstract

The River protocol extends the functionality of peer-to-peer file transfers over the BitTorrent protocol by enabling mutations of the files being shared and by versioning the mutations. This is not done by further extensions of the BitTorrent protocol but by wrapping it in a feed.

## Problem

The BitTorrent protocol is a scalable peer-to-peer file distribution protocol. To share a file set a torrent file is created with metadata describing the file set and information needed to find peers to share with. A great limitation of the protocol is that no files can be added, removed or mutated after the torrent has been created. To share a new revision of the file set a new torrent has to be created and shared. This causes peer fragmentation and distributed deprecated file sets.

File sets aggregated through archival require continuous additions to maintain completeness and despite being a scalable and well established file distribution protocol BitTorrent is ill suited by itself for sharing growing collections of files.

## River

River wraps torrent files in a dynamic feed to enable updating which torrent is operating on the file set. 

```json
{
    "title": "Collection of Linux ISOs",
    "revisions": [
        {
            "date": "2020-10-18T11:12:31+0000",
            "url": "https://tracker.example.com/torrents/1603019551/Collection.of.Linux.ISOs.torrent"
        }
    ]
}
```

When files are added to, mutated or removed from the file set, a new torrent is created and published to the feed. A River client can then add the latest torrent to a BitTorrent client and be up to date with the source without the user having to source a new torrent. Since the new revision operates on the same directory as the old one, any of the old files that are part of the new revision will not have to be downloaded again.

## Reference

A more readable version of the [JSON schema](./schema.json).

### Root Object

The root object represents the feed, a chronological series of torrents that distributes revisions of a file set.

| Property  | Necessity | Description                                           |
|-----------|-----------|-------------------------------------------------------|
| title     | Required  | String. Describes the set of files being distributed. |
| revisions | Required  | Array of revisions. Sorted by date from new to old.   |

### Revision

A revision represents a snapshot of the file set.

| Property | Necessity | Description                                                   |
|----------|-----------|---------------------------------------------------------------|
| date     | Required  | ISO-8601 representation of the date of publication.           |
| url      | Required  | URL to torrent file or magnet link distributing the revision. |

### Client Behavior

Apart from *the one rule* for River clients to abide by only behavior recommendations are provided.

#### The One Rule

For River to work with already present torrent clients the download path of revisions must be the same. It's of course possible to have each revision correspond to a different path but the intended use is to operate on a single file set to keep it up to date with that of a original peer while maintaining the peer-to-peer benefits of the BitTorrent protocol.

#### Adding, Deleting and Modifying Files

When processing a new revision the BitTorrent client should recheck the files managed by the torrent.

If a revision adds a file not present in the previous one it would simply be added to the download directory.

Similarly, if a file is modified the recheck should determine that the old file revision is incorrect causing the BitTorrent to replace it with the file from the newer revision.

However, if a file is deleted there should be a mechanism that removes the file not present in the selected revision. If the BitTorrent does not do this it might be suitable for the River client to remove the superfluous files.

#### Strategies 

Clients should support different strategies for handling a River feed. 

##### Latest  
The most common (and suitable default) strategy is keeping the latest revision torrent in the BitTorrent.

##### Force
A user can also force the client to use a certain older revision.
