const { Command, CommandError, Constants, ClientEmbed } = require("../../");
const { Song, Playlist } = require('../../music/structures')

module.exports = class Play extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'play',
      category: 'music',
      aliases: ['p', 'tocar'],
      utils: {
        requirements: { guildOnly: true, sameVoiceChannelOnly: true, voiceChannelOnly: true, playerManagerOnly: true },
        parameters: [{
          type: 'string', full: true, missingError: 'commands:play.noTrackIdentifier'
        }]
      }
    })
  }

  async run({ channel, flags, t, author, voiceChannel }, identifier) {
    const embed = new ClientEmbed(author);

    if (!voiceChannel.joinable && !voiceChannel.connection) {
      return channel.send(embed.setTitle(t('errors:voiceChannelJoin')))
    }

    const playerManager = this.client.playerManager;
    try {
      const specificSearch = flags['soundcloud'] || flags['youtube']

      let { result, tryAgain } = await playerManager.loadTracks(identifier.replace(/<?>?/g, ''), author)
      if (tryAgain && !result && !specificSearch) {
        result = (await playerManager.loadTracks(`ytsearch:${identifier.replace(/<?>?/g, '')}`, author)).result
      }

      if (result) {
        this.loadSongs({ t, channel, voiceChannel }, result, playerManager).then(() => channel.stopTyping())
      } else {
        throw new CommandError(t('music:songNotFound'))
      }
    } catch (e) {
      console.log(e.stack)
      if (e instanceof CommandError) throw e

      return channel.send(embed.setColor(Constants.ERROR_COLOR).setTitle(t('errors:generic')))
    }
  }

  loadSongs({ t, channel, voiceChannel }, res, playerManager) {
    if (res instanceof Song) {
      this.songFeedback({ t, channel }, res, true, true)
      return playerManager.play(res, voiceChannel)
    } else if (res instanceof Playlist) {
      this.playlistFeedback({ t, channel }, res, t)
      return Promise.all(res.songs.map(song => {
        this.songFeedback({ t, channel }, song, false, true)
        return playerManager.play(song, voiceChannel)
      }))
    }
    return Promise.reject(new Error('Invalid song instance.'))
  }

  playlistFeedback({ t, channel }, playlist) {
    const duration = `\`(${playlist.formattedDuration})\``
    const loadTime = playlist.loadTime
    const count = Number(playlist.size)
    const playlistName = `[${playlist.title}](${playlist.uri})`

    const timeResponses = t('commons:timeResponses', { returnObjects: true });

    channel.send(new ClientEmbed()
      .setThumbnail(playlist.artwork)
      .setDescription(t('music:addedFromPlaylist_plural', {
        count, playlistName, duration, loadTime: loadTime.allReplaces(
          timeResponses.obj(obj => {
            const [[k, v]] = Object.entries(obj)
            return [k, v]
          })
        )
      }))
    )
  }

  songFeedback({ t, channel }, song, queueFeedback = true, startFeedback = true) {
    const setMessage = (m) => song.setMessage(m);
    const deleteMessage = () => song.deleteMessage();

    const bEmbed = (d, u, timestamp) => new ClientEmbed(u, { timestamp }).setDescription(d);
    const send = (d, u) => channel.send(bEmbed(d, u));
    const sendWI = (d, i, u) => (t, ...f) => {
      const e = bEmbed(d, u, t).setThumbnail(i || song.artwork)
      if (f.length) e.setFooter(...f)
      return channel.send(e).then(m => m)
    }

    const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``
    const songName = `[${song.title}](${song.uri}) ${duration}`

    song.once('stop', u => send(` ${t('music:queueIsEmpty')}`, u) && deleteMessage())
    song.once('abruptStop', () => send(` ${t('music:leftDueToInactivity')}`) && deleteMessage())
    song.on('end', () => deleteMessage())

    song.once('error', () => channel.send(bEmbed(t('errors:musicReproducion')).setColor(Constants.ERROR_COLOR)).then(() => song.emit('end')))

    if (startFeedback) {
      song.on('start', async () => {
        setMessage(await sendWI(
          `${t('music:startedPlaying', { songName })}`
        )(song.addedAt, t('music:addedByCapitalize', { user: song.requestedBy.tag }), song.requestedBy.displayAvatarURL))
      })
    }

    if (queueFeedback) {
      song.once('queue', () => sendWI(`${t('music:addedToTheQueue', { songName })}`)())
    }
  }
}